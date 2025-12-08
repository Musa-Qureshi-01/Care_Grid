from utils.pdf_parser import extract_pdf_data

pdf = "data/provider_docs/provider_doc_1.pdf"
output = extract_pdf_data(pdf)

print("\n📄 Extracted PDF Data:")
print(output)
# from utils.pdf_parser import extract_text_from_pdf

# pdf = "data/provider_docs/provider_doc_1.pdf"

# text = extract_text_from_pdf(pdf)

# print("\n================ RAW PDF TEXT ================\n")
# print(text)
# print("\n==============================================\n")
