import chromadb
from sentence_transformers import SentenceTransformer


# ==========================================
# 1. Load Embedding Model
# ==========================================

embedding_model = SentenceTransformer(
    "all-MiniLM-L6-v2"
)


# ==========================================
# 2. Connect to ChromaDB
# ==========================================

client = chromadb.PersistentClient(
    path="./chroma_db"
)

collection = client.get_collection(
    name="vastra_knowledge"
)


# ==========================================
# 3. Ask Question
# ==========================================

query = input(
    "\nAsk Vastra AI: "
)


# ==========================================
# 4. Create Query Embedding
# ==========================================

query_embedding = embedding_model.encode(
    query
).tolist()


# ==========================================
# 5. Search ChromaDB
# ==========================================

results = collection.query(
    query_embeddings=[query_embedding],
    n_results=3,
    include=[
        "documents",
        "metadatas",
        "distances"
    ]
)


# ==========================================
# 6. Display Results
# ==========================================

print("\n================================")
print("RETRIEVAL RESULTS")
print("================================")

documents = results["documents"][0]
metadatas = results["metadatas"][0]
distances = results["distances"][0]

for i in range(len(documents)):

    print(
        f"\n--- RESULT {i + 1} ---"
    )

    print(
        "Distance:",
        distances[i]
    )

    print(
        "Category:",
        metadatas[i].get("category")
    )

    print(
        "Source:",
        metadatas[i].get("source")
    )

    print("\nDocument:")
    print(documents[i])