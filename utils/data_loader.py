import os
import pandas as pd

from utils.pdf_parser import extract_pdf_data
from utils.pdf_reader import extract_text_from_pdf


def safe_get(row, key, default=None):
    """Safely extract from Series or dict."""
    try:
        return row[key] if key in row else default
    except Exception:
        return default


def find_pdf_for_provider(name, pdf_dir="data/pdfs"):
    """Find PDF for provider by matching filename."""
    if not os.path.exists(pdf_dir):
        return None

    exact = os.path.join(pdf_dir, f"{name}.pdf")
    if os.path.exists(exact):
        return exact

    normalized = name.lower().replace(" ", "_").replace(".", "")

    for file in os.listdir(pdf_dir):
        f = file.lower().replace(" ", "_").replace(".", "")
        if f.startswith(normalized) and f.endswith(".pdf"):
            return os.path.join(pdf_dir, file)

    return None


def load_provider_with_pdf(row):
    """
    FINAL CLEAN VERSION
    - Accepts ONLY a Pandas row (Series)
    - Never accepts index
    - Never throws errors, only returns safe provider dict
    """

    provider = {
        "name": safe_get(row, "name", "Unknown"),
        "address": safe_get(row, "address", ""),
        "phone": safe_get(row, "phone", ""),
        "specialty": safe_get(row, "specialty", ""),
        "pdf_path": None,
        "pdf_text": "",
        "pdf_structured": {},
    }

    name = provider["name"]
    if not name or name == "Unknown":
        return provider

    pdf_path = find_pdf_for_provider(name)
    provider["pdf_path"] = pdf_path

    if not pdf_path:
        return provider

    # Extract raw text
    try:
        provider["pdf_text"] = extract_text_from_pdf(pdf_path)
    except:
        provider["pdf_text"] = ""

    # Extract structured fields
    try:
        provider["pdf_structured"] = extract_pdf_data(pdf_path)
    except:
        provider["pdf_structured"] = {}

    return provider
