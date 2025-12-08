import time
import uuid
import concurrent.futures
import pandas as pd

from database.db import (
    save_provider_result,
    save_batch_summary,
    save_fraud
)

from pipeline.pipeline_graph import build_pipeline
from utils.data_loader import load_provider_with_pdf

# Build agent pipeline once
AGENT_PIPELINE = build_pipeline()


# ------------------------------------------------------------
# FRAUD SCORE (SIMPLE VERSION, CAN BE IMPROVED IN STEP-7)
# ------------------------------------------------------------
def compute_fraud_score(quality_data, enriched_data):
    score = 0
    flags = []

    # Risk-based signals
    if quality_data["risk_level"] == "HIGH":
        score += 50
        flags.append("High risk profile")

    # Missing education signal
    if enriched_data.get("education") == "Unknown":
        score += 10
        flags.append("Missing education")

    # No affiliations = suspicious data
    if len(enriched_data.get("affiliations", [])) == 0:
        score += 5
        flags.append("No hospital affiliations")

    # Specialty mismatch
    if quality_data["discrepancies"].get("specialty_mismatch"):
        score += 20
        flags.append("Specialty mismatch")

    return min(score, 100), flags



# ------------------------------------------------------------
# PROCESS ONE PROVIDER
# ------------------------------------------------------------
def process_single_provider(row):
    provider_id = row["id"]

    # Convert merged CSV+PDF
    provider_input = load_provider_with_pdf(row)

    # Run 4-agent pipeline
    result = AGENT_PIPELINE.invoke({"provider": provider_input})

    validated = result["validated_data"]
    enriched = result["enriched_data"]
    quality = result["quality_data"]

    # Compute fraud insights
    fraud_score, fraud_flags = compute_fraud_score(quality, enriched)
    save_fraud(provider_id, fraud_score, fraud_flags)

    # Save final provider result into SQLite
    save_provider_result(provider_id, provider_input, validated, enriched, quality,
                         {"score": fraud_score, "flags": fraud_flags})

    return {
        "provider_id": provider_id,
        "confidence": quality["confidence_scores"]["overall"],
        "risk": quality["risk_level"],
        "verified": not quality["needs_manual_review"]
    }



# ------------------------------------------------------------
# MAIN BATCH ENGINE (FAST)
# ------------------------------------------------------------
def run_batch_processing(df):
    start_ts = time.time()
    batch_id = str(uuid.uuid4())[:8]

    results = []

    print(f"\n⚡ Running batch: {batch_id}")
    print(f"⚡ Providers: {len(df)}")

    # 10 threads for extremely fast execution
    with concurrent.futures.ThreadPoolExecutor(max_workers=10) as executor:
        futures = [executor.submit(process_single_provider, df.iloc[i])
                   for i in range(len(df))]

        for future in concurrent.futures.as_completed(futures):
            results.append(future.result())

    # Aggregate results
    total = len(results)
    verified = sum(1 for r in results if r["verified"])
    high_risk = sum(1 for r in results if r["risk"] == "HIGH")
    avg_conf = round(sum(r["confidence"] for r in results) / total, 2)

    # Save batch summary
    save_batch_summary(batch_id, total, verified, high_risk, avg_conf)

    duration = round(time.time() - start_ts, 2)

    return {
        "batch_id": batch_id,
        "duration": duration,
        "total": total,
        "verified": verified,
        "high_risk": high_risk,
        "avg_conf": avg_conf,
        "results": results
    }
