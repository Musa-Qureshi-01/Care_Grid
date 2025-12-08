# tools/compare_tools.py

import re
import difflib


def _normalize_phone(phone: str | None) -> str | None:
    if not phone:
        return None
    digits = re.sub(r"\D", "", phone)
    # assume US-style 10-digit or 11-digit with leading 1
    if len(digits) == 11 and digits.startswith("1"):
        digits = digits[1:]
    return digits if len(digits) == 10 else digits  # keep whatever we have


def _normalize_address(addr: str | None) -> str | None:
    if not addr:
        return None
    addr = addr.lower().strip()
    # common abbreviations
    replacements = {
        " street": " st",
        " avenue": " ave",
        " boulevard": " blvd",
        " road": " rd",
        " drive": " dr",
    }
    for k, v in replacements.items():
        addr = addr.replace(k, v)
    addr = re.sub(r"[,\.\s]+", " ", addr)
    return addr.strip()


def _similarity(a: str | None, b: str | None) -> float:
    if not a or not b:
        return 0.0
    return difflib.SequenceMatcher(None, a, b).ratio()


def compare_data(provider: dict, google_data: dict, npi_data: dict) -> dict:
    """
    Advanced comparison logic with normalization + similarity.

    Returns a dict used by Agent-1 and Agent-3:
      {
        "phone_match": bool,
        "address_match": bool,
        "specialty_match": bool,
        "phone_similarity": float,
        "address_similarity": float,
        "corrected_phone": str | None,
        "corrected_address": str | None,
        "license": str | None,
    }
    """
    p_phone_raw = provider.get("phone")
    p_addr_raw = provider.get("address")
    p_spec = provider.get("specialty")

    g_phone_raw = google_data.get("google_phone")
    g_addr_raw = google_data.get("google_address")

    npi_spec = npi_data.get("npi_specialty")
    npi_license = npi_data.get("npi_license")

    # ---- Normalize ----
    p_phone = _normalize_phone(p_phone_raw)
    g_phone = _normalize_phone(g_phone_raw)

    p_addr = _normalize_address(p_addr_raw)
    g_addr = _normalize_address(g_addr_raw)

    # ---- Similarity ----
    phone_sim = _similarity(p_phone, g_phone)
    addr_sim = _similarity(p_addr, g_addr)

    phone_match = bool(p_phone and g_phone and phone_sim >= 0.85)
    address_match = bool(p_addr and g_addr and addr_sim >= 0.85)
    specialty_match = bool(p_spec and npi_spec and p_spec.lower() == npi_spec.lower())

    # corrected values – prefer google/NPI if high similarity
    corrected_phone = g_phone_raw if phone_sim >= 0.6 else None
    corrected_address = g_addr_raw if addr_sim >= 0.6 else None

    return {
        "phone_match": phone_match,
        "address_match": address_match,
        "specialty_match": specialty_match,
        "phone_similarity": round(phone_sim, 3),
        "address_similarity": round(addr_sim, 3),
        "corrected_phone": corrected_phone,
        "corrected_address": corrected_address,
        "license": npi_license,
    }
