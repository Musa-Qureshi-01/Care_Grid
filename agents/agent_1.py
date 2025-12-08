from tools.google_tools import get_google_data
from tools.npi_tools import get_npi_data
from tools.compare_tools import compare_data


def validation_agent(state):
    """
    Agent-1: Provider Data Validation

    INPUT:
        state["provider"] contains merged CSV + PDF data.

    OUTPUT:
        {
            "validated_data": {...},
            "google_result": {...},
            "npi_result": {...}
        }
    """

    provider = state["provider"]

    # STEP 1: Decide which phone/address to validate
    # ------------------------------------------
    # PDF > CSV (recommended for hackathon)
    name = provider.get("name")

    address = provider.get("address")
    pdf_address = provider.get("pdf_address")
    if pdf_address:
        address = pdf_address

    phone = provider.get("phone")
    pdf_phone = provider.get("pdf_phone")
    if pdf_phone:
        phone = pdf_phone

    specialty = provider.get("specialty")
    pdf_specialty = provider.get("pdf_specialty")
    if pdf_specialty:
        specialty = pdf_specialty

    cleaned_provider = {
        "name": name,
        "address": address,
        "phone": phone,
        "specialty": specialty
    }

    # STEP 2: Call validation APIs
    google_res = get_google_data(name, address)
    npi_res = get_npi_data(name)

    # STEP 3: Compare values
    validated = compare_data(cleaned_provider, google_res, npi_res)

    # STEP 4: Return to pipeline
    return {
        "validated_data": validated,
        "google_result": google_res,
        "npi_result": npi_res
    }
