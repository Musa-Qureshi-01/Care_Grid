import random

SPECIALTIES = [
    "Cardiology", "Dermatology", "Pediatrics", "Radiology",
    "Oncology", "Neurology", "Psychiatry", "Gastroenterology",
    "Endocrinology", "Orthopedics"
]

def fake_license():
    letters = random.choice(["A", "B", "C", "D"])
    return f"{letters}{random.randint(10000, 99999)}"

def get_npi_data(name):
    """
    Synthetic NPI-like registry results.
    """

    scenarios = [
        # 40% = valid + reliable
        {
            "npi_specialty": random.choice(SPECIALTIES),
            "npi_license": fake_license(),
            "license_status": "Active",
            "source_reliability": 0.9
        },

        # 30% = mismatch specialty
        {
            "npi_specialty": random.choice(SPECIALTIES),
            "npi_license": fake_license(),
            "license_status": "Active",
            "source_reliability": 0.7
        },

        # 20% = missing specialty
        {
            "npi_specialty": None,
            "npi_license": fake_license(),
            "license_status": "Unknown",
            "source_reliability": 0.5
        },

        # 10% suspended
        {
            "npi_specialty": random.choice(SPECIALTIES),
            "npi_license": fake_license(),
            "license_status": "Suspended",
            "source_reliability": 0.3
        }
    ]

    return random.choice(scenarios)
