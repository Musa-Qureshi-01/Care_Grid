import pandas as pd
from pipeline.batch_engine import run_batch_processing

df = pd.read_csv("data/providers.csv").head(200)

result = run_batch_processing(df)

print("\nBatch Completed:")
print(result)