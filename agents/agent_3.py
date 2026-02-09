# agents/agent_3.py

from __future__ import annotations
from typing import Dict, Any


def _fraud_signals(provider: Dict[str, Any],
                   validated: Dict[str, Any],
                   enriched: Dict[str, Any]) -> dict:
    """
    Simple rule-based fraud detector.
    Does NOT rely on DB so works in any environment.
    """
    signals = []
    score = 0

    phone = provider.get("phone")
    address = provider.get("address")
    license_id = validated.get("license")
    spec_match = validated.get("specialty_match")

    # 1) Missing critical fields
    if not phone or not address:
        signals.append("missing_contact_info")
        score += 20

    if not license_id:
        signals.append("missing_license")
        score += 30

    # 2) Weird license format
    # e.g. too short, all digits, or no letter prefix
    if license_id and (len(license_id) < 5 or license_id.isdigit()):
        signals.append("suspicious_license_pattern")
        score += 20

    # 3) Specialty mismatch
    if spec_match is False:
        signals.append("specialty_mismatch")
        score += 15

    # 4) No enrichment info
    if enriched.get("education") in (None, "Unknown"):
        signals.append("no_education_info")
        score += 10

    # Cap fraud score
    score = min(score, 100)

    return {
        "fraud_score": score,
        "fraud_flags": signals,
    }


def quality_agent(state):
    """
    Agent-3: Quality Assurance + Confidence Engine + Fraud Detection
    """
    print(f"\n--- QA Agent Started for {state['provider'].get('name')} ---")

    provider = state["provider"]
    validated = state["validated_data"]
    enriched = state["enriched_data"]

    phone_match = validated.get("phone_match")
    addr_match = validated.get("address_match")
    spec_match = validated.get("specialty_match")
    license_id = validated.get("license")
    
    phone_sim = validated.get("phone_similarity", 0.0)
    addr_sim = validated.get("address_similarity", 0.0)

    # -----------------------------
    # 1) Mathematical Scoring (Max 100)
    # -----------------------------
    
    score_components = {
        "phone": 0,
        "address": 0,
        "license": 0,
        "specialty": 0,
        "education": 0,
        "affiliations": 0
    }

    # PHONE (Max 15%)
    if phone_match:
        score_components["phone"] = 15
    elif phone_sim >= 0.7:
        score_components["phone"] = 10
    elif phone_sim > 0.4:
        score_components["phone"] = 5
    
    # ADDRESS (Max 25%)
    if addr_match:
        score_components["address"] = 25
    elif addr_sim >= 0.7:
        score_components["address"] = 15
    elif addr_sim > 0.4:
        score_components["address"] = 5
        
    # LICENSE (Max 25%) - The Trust Anchor
    if license_id and license_id not in ["Not Found", "Error"]:
        score_components["license"] = 25
        
    # SPECIALTY (Max 15%)
    if spec_match:
        score_components["specialty"] = 15
    elif provider.get("specialty") and license_id and license_id not in ["Not Found", "Error"]:
        # If NPI exists and we have a specialty, give partial credit
        score_components["specialty"] = 10
    
    # EDUCATION (Max 10%)
    has_edu = enriched.get("education") and enriched.get("education") != "Unknown"
    if has_edu: 
        score_components["education"] = 10

    # AFFILIATIONS (Max 10%)
    has_affil = enriched.get("affiliations") and len(enriched.get("affiliations", [])) > 0
    if has_affil:
        score_components["affiliations"] = 10

    # TOTAL SCORE
    overall = sum(score_components.values())
    
    # Log components for debugging
    print(f"Scoring Components: {score_components}")
    print(f"Total Score (Confidence): {overall}")

    confidence_scores = {
        "phone": score_components["phone"],
        "address": score_components["address"],
        "specialty": score_components["specialty"],
        "license": score_components["license"],
        "education": score_components["education"],
        "affiliations": score_components["affiliations"],
        "overall": overall,
    }

    # -----------------------------
    # 2) Discrepancies
    # -----------------------------
    discrepancies = {
        "phone_mismatch": not bool(phone_match),
        "address_mismatch": not bool(addr_match),
        "specialty_mismatch": not bool(spec_match),
        "missing_license": not license_id or license_id in ["Not Found", "Error"],
    }

    # -----------------------------
    # 3) Fraud Detection
    # -----------------------------
    fraud = _fraud_signals(provider, validated, enriched)
    fraud_score = fraud["fraud_score"]
    
    # If NPI is missing, Fraud Score spikes
    if not license_id or license_id in ["Not Found", "Error"]:
        fraud_score += 30

    # -----------------------------
    # 4) Risk Classification
    # -----------------------------
    # Rule: >= 85 → LOW, 65–84 → MEDIUM, < 65 → HIGH
    
    risk = "unknown"
    needs_manual = True
    
    if overall >= 85:
        risk = "LOW"
        needs_manual = False
    elif overall >= 65:
        risk = "MEDIUM"
        needs_manual = True
    else:
        risk = "HIGH"
        needs_manual = True
        
    # Override: High Fraud Score always maps to High Risk
    if fraud_score > 60:
        risk = "HIGH"
        needs_manual = True

    print(f"Computed Risk: {risk} (Fraud Score: {fraud_score})")

    qa_output = {
        "confidence_scores": confidence_scores,
        "discrepancies": discrepancies,
        "risk_level": risk,
        "needs_manual_review": needs_manual,
        "fraud_score": fraud_score,
        "fraud_flags": fraud["fraud_flags"],
        "provider_name": provider.get("name"),
        "specialty": provider.get("specialty"),
    }

    return {"quality_data": qa_output}
