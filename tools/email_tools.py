# tools/email_tools.py

from typing import Dict, Any


def build_provider_email(profile: Dict[str, Any], quality: Dict[str, Any]) -> str:
    """
    Build a plain-text email to provider explaining discrepancies.
    This is not actually sending – just generating content.
    """
    name = profile.get("name", "Doctor")
    risk = profile.get("risk_level", "MEDIUM")
    conf = profile.get("confidence_overall", 0)
    discrepancies = quality.get("discrepancies", {})

    mismatch_fields = []
    if discrepancies.get("phone_mismatch"):
        mismatch_fields.append("phone number")
    if discrepancies.get("address_mismatch"):
        mismatch_fields.append("practice address")
    if discrepancies.get("specialty_mismatch"):
        mismatch_fields.append("specialty")

    issues_text = ", ".join(mismatch_fields) if mismatch_fields else "basic profile details"

    email = f"""
Dear {name},

We are currently updating our provider directory to ensure that members can
reliably reach you and access accurate information about your practice.

During an automated data quality review, your profile was assigned a
confidence score of {conf}% with overall risk level marked as {risk}.

Our system detected potential discrepancies related to: {issues_text}.

We kindly request you to review your practice information in the directory
and share any corrections if needed (phone, address, specialty, or license).

If the information shown is already correct, no further action is required.

Thank you for helping us maintain a high-quality provider network.

Best regards,
Provider Data Quality Team
"""

    return email.strip()
