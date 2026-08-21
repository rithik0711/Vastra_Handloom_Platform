import pandas as pd
import chromadb
from sentence_transformers import SentenceTransformer


# ==========================================
# 1. Load Dataset
# ==========================================

DATASET_PATH = "Data/vastra_complete_handloom_dataset.csv"

df = pd.read_csv(DATASET_PATH)

print("Dataset loaded successfully!")
print("Number of records:", len(df))
print("Columns:", list(df.columns))


# ==========================================
# 2. Validate Required Columns
# ==========================================

required_columns = [
    "id",
    "domain",
    "category",
    "audience",
    "question",
    "answer",
    "keywords",
    "source"
]

missing_columns = [
    column for column in required_columns
    if column not in df.columns
]

if missing_columns:
    raise ValueError(
        f"Missing columns: {missing_columns}"
    )


# ==========================================
# 3. Remove Empty Records
# ==========================================

df = df.dropna(
    subset=["question", "answer"]
)

df = df.fillna("")


# ==========================================
# 4. Create Documents
# ==========================================

documents = []

metadatas = []

ids = []

for _, row in df.iterrows():

    document = f"""
Domain: {row['domain']}

Category: {row['category']}

Audience: {row['audience']}

Question: {row['question']}

Answer: {row['answer']}

Keywords: {row['keywords']}

Source: {row['source']}
""".strip()

    documents.append(document)

    metadatas.append({
        "domain": str(row["domain"]),
        "category": str(row["category"]),
        "audience": str(row["audience"]),
        "source": str(row["source"])
    })

    ids.append(str(row["id"]))


print("\nDocuments created:", len(documents))


# ==========================================
# 5. Load Embedding Model
# ==========================================

print("\nLoading embedding model...")

embedding_model = SentenceTransformer(
    "all-MiniLM-L6-v2"
)

print("Embedding model loaded.")


# ==========================================
# 6. Generate Embeddings
# ==========================================

print("\nGenerating embeddings...")

embeddings = embedding_model.encode(
    documents,
    show_progress_bar=True
).tolist()

print("Embeddings generated.")


# ==========================================
# 7. Create ChromaDB
# ==========================================

client = chromadb.PersistentClient(
    path="./chroma_db"
)

collection = client.get_or_create_collection(
    name="vastra_knowledge"
)


# ==========================================
# 8. Clear Existing Data
# ==========================================

existing_count = collection.count()

if existing_count > 0:

    print(
        f"\nExisting records found: {existing_count}"
    )

    print("Clearing existing collection...")

    existing_data = collection.get()

    if existing_data["ids"]:
        collection.delete(
            ids=existing_data["ids"]
        )


# ==========================================
# 9. Store in ChromaDB
# ==========================================

print("\nStoring documents in ChromaDB...")

collection.add(
    ids=ids,
    documents=documents,
    embeddings=embeddings,
    metadatas=metadatas
)


# ==========================================
# 10. Final Information
# ==========================================

print("\n================================")
print("RAG INGESTION COMPLETED")
print("================================")

print(
    "Documents stored:",
    collection.count()
)