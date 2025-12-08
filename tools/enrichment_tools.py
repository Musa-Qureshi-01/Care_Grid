# tools/enrichment_tools.py

from langchain.tools import tool

# ------------------------------
# Helper + Static Knowledge
# ------------------------------

MED_SCHOOLS = [
    "Harvard Medical School",
    "Johns Hopkins School of Medicine",
    "Stanford University School of Medicine",
    "Mayo Clinic Alix School of Medicine",
    "Columbia University Vagelos College of Physicians and Surgeons",
    "Perelman School of Medicine at the University of Pennsylvania",
    "Yale School of Medicine",
    "Duke University School of Medicine",
    "University of Michigan Medical School",
    "Northwestern University Feinberg School of Medicine",
    "Baylor College of Medicine",
    "University of Pittsburgh School of Medicine",
]

BOARD_CERT_BY_SPECIALTY = {
    "Cardiology": "ABIM – Cardiovascular Disease",
    "Gastroenterology": "ABIM – Gastroenterology",
    "Pediatrics": "ABP – Pediatrics",
    "Dermatology": "ABD – Dermatology",
    "Oncology": "ABIM – Medical Oncology",
    "Neurology": "ABPN – Neurology",
    "Psychiatry": "ABPN – Psychiatry",
    "Orthopedics": "ABOS – Orthopaedic Surgery",
    "Endocrinology": "ABIM – Endocrinology, Diabetes & Metabolism",
    "Radiology": "ABR – Diagnostic Radiology",
}

HOSPITALS_BY_STATE = {
    "PA": [
        "UPMC Presbyterian",
        "Allegheny General Hospital",
        "Penn Presbyterian Medical Center",
    ],
    "FL": [
        "Jackson Memorial Hospital",
        "Mayo Clinic Florida",
        "Tampa General Hospital",
    ],
    "MI": [
        "Michigan Medicine – Ann Arbor",
        "Henry Ford Hospital",
        "Beaumont Hospital Royal Oak",
    ],
    "GA": [
        "Emory University Hospital",
        "Piedmont Atlanta Hospital",
        "Northside Hospital Atlanta",
    ],
    "TX": [
        "Houston Methodist Hospital",
        "Baylor St. Luke’s Medical Center",
        "UT Southwestern Medical Center",
    ],
    "CA": [
        "UCLA Medical Center",
        "Stanford Health Care",
        "UCSF Medical Center",
    ],
    "NY": [
        "NewYork–Presbyterian Hospital",
        "NYU Langone Health",
        "Mount Sinai Hospital",
    ],
    "NC": [
        "Duke University Hospital",
        "UNC Hospitals",
        "Wake Forest Baptist Health",
    ],
    "OH": [
        "Cleveland Clinic",
        "Ohio State University Wexner Medical Center",
        "Cincinnati Children’s Hospital",
    ],
    "IL": [
        "Northwestern Memorial Hospital",
        "University of Chicago Medical Center",
        "Rush University Medical Center",
    ],
    "DEFAULT": [
        "General City Hospital",
        "Regional Medical Center",
    ],
}

INSURANCE_PANELS = [
    "Aetna",
    "Cigna",
    "UnitedHealthcare",
    "Blue Cross Blue Shield",
    "Humana",
    "Kaiser Permanente",
]


def _stable_index(key: str, mod: int) -> int:
    """Deterministic index from a string key."""
    return abs(hash(key)) % mod


def _extract_state_from_address(address: str) -> str:
    """Parse last token as state code. Example: '3897 Oak Drive, PA' → 'PA'."""
    if not address:
        return "DEFAULT"
    parts = address.split(",")
    last = parts[-1].strip()
    state = last.split()[0].upper()
    if len(state) == 2:
        return state
    return "DEFAULT"


# ------------------------------
# LangChain Tools
# ------------------------------


@tool
def education_tool(name: str) -> dict:
    """
    Return a realistic but synthetic medical school for the given provider.
    Deterministic by provider name.
    """
    idx = _stable_index(name, len(MED_SCHOOLS))
    school = MED_SCHOOLS[idx]
    return {"education": school}


@tool
def certification_tool(name: str, specialty: str) -> dict:
    """
    Return realistic-looking board certification based on provider specialty.
    Falls back to a generic internal medicine board if unknown.
    """
    board = BOARD_CERT_BY_SPECIALTY.get(
        specialty,
        "ABIM – Internal Medicine",
    )
    return {"board_certification": board}


@tool
def affiliation_tool(name: str, address: str) -> dict:
    """
    Return 1–2 realistic hospital affiliations based on state inferred from address.
    Deterministic per name+address.
    """
    state = _extract_state_from_address(address)
    hospitals = HOSPITALS_BY_STATE.get(state, HOSPITALS_BY_STATE["DEFAULT"])

    if not hospitals:
        return {"affiliations": []}

    base_key = f"{name}-{address}"
    idx = _stable_index(base_key, len(hospitals))

    aff_list = [hospitals[idx]]
    if len(hospitals) > 1:
        alt = (idx + 1) % len(hospitals)
        if hospitals[alt] not in aff_list:
            aff_list.append(hospitals[alt])

    return {"affiliations": aff_list}


@tool
def insurance_panel_tool(name: str, specialty: str, address: str) -> dict:
    """
    Return 2–4 synthetic insurance networks the provider participates in.
    Deterministic and based on name+specialty+state.
    """
    state = _extract_state_from_address(address)
    key = f"{name}-{specialty}-{state}"
    start = _stable_index(key, len(INSURANCE_PANELS))

    # pick 3 consecutive insurers in a circular fashion
    panel = []
    for i in range(3):
        panel.append(INSURANCE_PANELS[(start + i) % len(INSURANCE_PANELS)])

    return {"accepted_insurances": panel}
