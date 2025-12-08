import fitz  # PyMuPDF
import re
import os
from utils.pdf_reader import extract_text_from_pdf


def extract_text_from_pdf(pdf_path):
    """
    Extract raw text from PDF using PyMuPDF.
    """
    try:
        doc = fitz.open(pdf_path)
        text = ""
        for page in doc:
            text += page.get_text()
        return text
    except Exception as e:
        print(f"❌ PDF read error: {e}")
        return ""


def extract_field(pattern, text):
    """
    Generic regex extractor. Returns first match or None.
    """
    match = re.search(pattern, text, re.IGNORECASE)
    if match:
        return match.group(1).strip()
    return None


import re
from utils.pdf_reader import extract_text_from_pdf

def extract_pdf_data(pdf_path):
    """Extract structured fields from PDF text using regex patterns."""

    try:
        text = extract_text_from_pdf(pdf_path)
    except Exception as e:
        print(f"PDF Read Error: {e}")
        return {}

    if not text or text.strip() == "":
        return {}

    # ------------ IMPROVED EY-GRADE REGEX ------------
    patterns = {
        "pdf_name": r"Name:\s*(.*?)(?=\s*Address:|$)",
        "pdf_address": r"Address:\s*(.*?)(?=\s*Phone:|$)",
        "pdf_phone": r"Phone:\s*([\(\)\d\-\s]+)(?=\s*Specialty:|$)",
        "pdf_specialty": r"Specialty:\s*(.*?)(?=\s*License:|$)",
        "pdf_license": r"License:\s*([A-Za-z0-9\-]+)"
    }

    extracted = {}

    for key, pattern in patterns.items():
        match = re.search(pattern, text, re.IGNORECASE | re.DOTALL)
        extracted[key] = match.group(1).strip() if match else None

    print("\n📄 Extracted Structured Data:")
    print(extracted)

    return extracted

