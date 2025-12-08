# agents/agent_2.py

from tools.enrichment_tools import (
    education_tool,
    certification_tool,
    affiliation_tool,
    insurance_panel_tool,
)


def enrichment_agent(state):
    """
    Agent-2: Information Enrichment Agent

    INPUT:
        state['provider']       → merged CSV + PDF data
        state['validated_data'] → Agent-1 validation output

    OUTPUT:
        {
            "enriched_data": {
                name, address, phone, specialty, license,
                education, board_certification, affiliations,
                accepted_insurances
            }
        }
    """

    provider = state["provider"]
    validated = state.get("validated_data", {})

    name = provider.get("name")

    # -------------------------------
    # PRIORITY: PDF > CSV
    # -------------------------------
    address = provider.get("pdf_address", provider.get("address"))
    phone = provider.get("pdf_phone", provider.get("phone"))
    specialty = provider.get("pdf_specialty", provider.get("specialty"))
    license_value = validated.get("license", provider.get("license"))

    enriched_profile = {
        "name": name,
        "address": address,
        "phone": phone,
        "specialty": specialty,
        "license": license_value,
    }

    # -------------------------------
    # RUN ENRICHMENT TOOLS (LangChain)
    # -------------------------------
    # 1) Education
    edu_res = education_tool.run({"name": name})

    # 2) Board Certification (based on specialty)
    cert_res = certification_tool.run({"name": name, "specialty": specialty or ""})

    # 3) Hospital Affiliations (based on state/address)
    aff_res = affiliation_tool.run({"name": name, "address": address or ""})

    # 4) Insurance Panels
    ins_res = insurance_panel_tool.run(
        {"name": name, "specialty": specialty or "", "address": address or ""}
    )

    # -------------------------------
    # FINAL MERGE (PDF > tools)
    # -------------------------------
    enriched_profile["education"] = provider.get(
        "pdf_education",
        edu_res.get("education"),
    )
    enriched_profile["board_certification"] = provider.get(
        "pdf_board_certification",
        cert_res.get("board_certification"),
    )
    enriched_profile["affiliations"] = provider.get(
        "pdf_affiliations",
        aff_res.get("affiliations"),
    )
    enriched_profile["accepted_insurances"] = provider.get(
        "pdf_accepted_insurances",
        ins_res.get("accepted_insurances"),
    )

    return {
        "enriched_data": enriched_profile
    }
