from sentence_transformers import SentenceTransformer

model = SentenceTransformer("all-MiniLM-L6-v2")

text = "How should I maintain a silk saree?"

embedding = model.encode(text)

print("Embedding:")
print(embedding)

print("\nEmbedding dimensions:")
print(len(embedding))