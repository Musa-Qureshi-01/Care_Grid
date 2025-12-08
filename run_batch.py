import pandas as pd
import os

from pipeline.pipeline_graph import build_pipeline
from utils.pdf_parser import extract_pdf_data   # <-- PDF extractor


# ---------------------------------------------
# Load Pipeline
# ---------------------------------------------
app = build_pipeline()

# ---------------------------------------------
# Load 200+ Provider CSV
# ---------------------------------------------
CSV_PATH = "data/providers.csv"
PDF_FOLDER = "data/provider_docs"

df = pd.read_csv(CSV_PATH)

print(f"\n🔍 Total Providers Loaded: {len(df)}")
print("🚀 Running Batch Validation with CSV + PDF...\n")

all_results = []


# ---------------------------------------------
# Process Each Provider
# ---------------------------------------------
for idx, row in df.iterrows():

    # ---- CSV Base Data ----
    provider = {
        "name": row["name"],
        "address": row["address"],
        "phone": row["phone"],
        "specialty": row["specialty"]
    }

    # ---- Check if a Matching PDF Exists ----
    pdf_filename = f"{row['name'].replace(' ', '_')}.pdf"
    pdf_path = os.path.join(PDF_FOLDER, pdf_filename)

    pdf_data = {}

    if os.path.exists(pdf_path):
        print(f"📄 Extracting PDF for: {row['name']} ...")
        try:
            pdf_data = extract_pdf_data(pdf_path)
        except Exception as e:
            print(f"⚠ PDF extraction failed for {row['name']}: {e}")

    # ---- Merge CSV + PDF → Final Provider Input ----
    provider.update(pdf_data)

    # ---- Send Provider Data Into Multi-Agent Pipeline ----
    result = app.invoke({"provider": provider})

    final_output = result.get("final_profile", {})
    final_output["provider_id"] = idx + 1

    all_results.append(final_output)

    print(f"✔ Processed Provider {idx + 1}: {row['name']}")


# ---------------------------------------------
# Save Final Output
# ---------------------------------------------
output_df = pd.DataFrame(all_results)

OUTPUT_PATH = "data/final_results.csv"
output_df.to_csv(OUTPUT_PATH, index=False)

print("\n🎉 Batch Processing Completed Successfully!")
print(f"📁 Results saved to: {OUTPUT_PATH}")
print("\nPreview of Final Output:")
print(output_df.head())

