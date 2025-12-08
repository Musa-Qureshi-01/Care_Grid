import fitz  # PyMuPDF

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
