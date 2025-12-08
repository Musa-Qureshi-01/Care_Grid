import pandas as pd
from utils.data_loader import load_provider_with_pdf
from pipeline.pipeline_graph import build_pipeline

# -----------------------------------------
# 1. Build the pipeline
# -----------------------------------------
app = build_pipeline()

# -----------------------------------------
# 2. Load Providers CSV
# -----------------------------------------
CSV_PATH = "data/providers.csv"
df = pd.read_csv(CSV_PATH)

# Pick provider index (0 = first provider)
row_index = 0

# -----------------------------------------
# 3. Load Provider + PDF (Merged Input)
# -----------------------------------------
row = df.iloc[row_index]
provider = load_provider_with_pdf(row)

print("\n🔍 Loaded Provider Data (Merged CSV + PDF):")
print(provider)

# -----------------------------------------
# 4. Run Full 4-Agent Pipeline
# -----------------------------------------
result = app.invoke({"provider": provider})

# -----------------------------------------
# 5. Display Outputs
# -----------------------------------------
print("\n--- Agent-1 (Validation) ---")
print(result.get("validated_data"))

print("\n--- Agent-2 (Enrichment) ---")
print(result.get("enriched_data"))

print("\n--- Agent-3 (Quality Assurance) ---")
print(result.get("quality_data"))

print("\n--- Agent-4 (Directory Management) ---")
print(result.get("final_profile"))

print("\n--- Summary Report ---")
print(result.get("summary_report"))
