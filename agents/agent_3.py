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
    # 1) Weighted Confidence Scoring
    # -----------------------------
    # Source weights (total ~= 1.0)
    WEIGHTS = {
        "csv": 0.10,
        "google": 0.20,
        "npi": 0.30,
        "pdf": 0.40,
    }

    # PHONE
    phone_score = 0.0
    if phone_match:
        phone_score = 100 * (WEIGHTS["google"] + WEIGHTS["csv"])
    elif phone_sim >= 0.6:
        phone_score = 60 * WEIGHTS["google"]
    elif phone_sim > 0:
        phone_score = 30 * WEIGHTS["google"]

    # ADDRESS
    addr_score = 0.0
    if addr_match:
        addr_score = 100 * (WEIGHTS["google"] + WEIGHTS["csv"])
    elif addr_sim >= 0.6:
        addr_score = 60 * WEIGHTS["google"]
    elif addr_sim > 0:
        addr_score = 30 * WEIGHTS["google"]

    # SPECIALTY
    spec_score = 0.0
    if spec_match:
        spec_score = 100 * WEIGHTS["npi"]
    elif provider.get("specialty"):
        spec_score = 40 * WEIGHTS["npi"]

    # LICENSE
    lic_score = 0.0
    if license_id:
        lic_score = 100 * WEIGHTS["npi"]
    # else 0

    # OVERALL (0-100)
    overall = round(phone_score + addr_score + spec_score + lic_score, 1)
    overall = max(0.0, min(100.0, overall))

    confidence_scores = {
        "phone": round(phone_score, 1),
        "address": round(addr_score, 1),
        "specialty": round(spec_score, 1),
        "license": round(lic_score, 1),
        "overall": overall,
    }

    # -----------------------------
    # 2) Discrepancies
    # -----------------------------
    discrepancies = {
        "phone_mismatch": not bool(phone_match),
        "address_mismatch": not bool(addr_match),
        "specialty_mismatch": not bool(spec_match),
        "missing_phone_data": provider.get("phone") is None,
        "missing_address_data": provider.get("address") is None,
        "missing_license": license_id is None,
    }

    # -----------------------------
    # 3) Fraud Detection
    # -----------------------------
    fraud = _fraud_signals(provider, validated, enriched)
    fraud_score = fraud["fraud_score"]

    # -----------------------------
    # 4) Risk Classification
    # -----------------------------
    if overall >= 80 and fraud_score < 30:
        risk = "LOW"
        needs_manual = False
    elif overall >= 50 and fraud_score < 60:
        risk = "MEDIUM"
        needs_manual = True
    else:
        risk = "HIGH"
        needs_manual = True

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
