# agents/agent_4.py

from __future__ import annotations
from typing import Dict, Any
from utils.exporter import mask_phone, mask_license
from tools.email_tools import build_provider_email


# specialty impact weight (for ranking)
SPECIALTY_WEIGHT = {
    "Cardiology": 1.0,
    "Oncology": 0.9,
    "Neurology": 0.85,
    "Orthopedics": 0.8,
    "Gastroenterology": 0.75,
    "Pediatrics": 0.7,
    "Dermatology": 0.6,
}


def _priority_score(conf: float, risk: str, fraud: float, specialty: str | None) -> float:
    risk_weight = {"LOW": 1.0, "MEDIUM": 0.6, "HIGH": 0.2}.get(risk, 0.5)
    spec_w = SPECIALTY_WEIGHT.get(specialty or "", 0.5)

    # Higher confidence, lower fraud, higher impact specialty
    score = (conf * 0.5) + ((100 - fraud) * 0.3) + (spec_w * 20) + (risk_weight * 10)
    return round(score, 1)


def directory_agent(state: Dict[str, Any]) -> Dict[str, Any]:
    """
    Agent-4: Directory Management Agent
    - Combines all outputs
    - Computes provider status + priority ranking
    - Masks sensitive values for reports
    - Generates email text (not sending, just template)
    """

    provider = state["provider"]
    enriched = state["enriched_data"]
    quality = state["quality_data"]

    conf_overall = quality["confidence_scores"]["overall"]
    risk = quality["risk_level"]
    fraud_score = quality["fraud_score"]
    specialty = provider.get("specialty")

    priority = _priority_score(conf_overall, risk, fraud_score, specialty)

    # Determine human-friendly status
    if risk == "LOW" and conf_overall >= 80:
        status = "Verified"
    elif risk == "HIGH" and conf_overall < 50:
        status = "At-Risk"
    else:
        status = "Partially Verified"

    final_profile = {
        "name": provider.get("name"),
        "address_original": provider.get("address"),
        "address_corrected": quality["discrepancies"].get("address_mismatch")
        and enriched.get("address") or provider.get("address"),
        "phone_original": mask_phone(provider.get("phone")),
        "phone_corrected": mask_phone(
            state.get("validated_data", {}).get("corrected_phone")
        ),
        "specialty": specialty,
        "license": mask_license(enriched.get("license")),
        "education": enriched.get("education"),
        "board_certification": enriched.get("board_certification"),
        "affiliations": enriched.get("affiliations"),
        "accepted_insurances": enriched.get("accepted_insurances"),
        "confidence_overall": conf_overall,
        "risk_level": risk,
        "fraud_score": fraud_score,
        "needs_manual_review": quality["needs_manual_review"],
        "provider_status": status,
        "priority_score": priority,
    }

    # Email template (string)
    email_text = build_provider_email(final_profile, quality)

    summary_report = {
        "Provider Name": final_profile["name"],
        "Status": status,
        "Overall Confidence": f"{conf_overall}%",
        "Risk Level": risk,
        "Fraud Score": fraud_score,
        "Priority Score": priority,
        "Needs Manual Review": "YES" if final_profile["needs_manual_review"] else "NO",
        "Masked Phone": final_profile["phone_original"],
        "Masked License": final_profile["license"],
        "Email Draft": email_text,
    }

    return {
        "final_profile": final_profile,
        "summary_report": summary_report,
    }
