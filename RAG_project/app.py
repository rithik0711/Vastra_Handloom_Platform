import os

from dotenv import load_dotenv

from fastapi import (
    FastAPI,
    HTTPException
)

from fastapi.middleware.cors import CORSMiddleware

from pydantic import BaseModel

import chromadb

from sentence_transformers import (
    SentenceTransformer
)

from generate import generate_answer


# ============================================================
# ENVIRONMENT
# ============================================================

load_dotenv()


# ============================================================
# FASTAPI APPLICATION
# ============================================================

app = FastAPI(
    title="Vastra RAG API",
    description="RAG service for Vastra Handloom Platform",
    version="1.0.0"
)


# ============================================================
# CORS
# ============================================================

app.add_middleware(

    CORSMiddleware,

    allow_origins=[
        "http://localhost:5173"
    ],

    allow_credentials=True,

    allow_methods=["*"],

    allow_headers=["*"]
)


# ============================================================
# REQUEST MODEL
# ============================================================

class QuestionRequest(BaseModel):

    question: str


# ============================================================
# LOAD EMBEDDING MODEL
# ============================================================

print()
print("========================================")
print("Loading embedding model...")
print("========================================")


embedding_model = SentenceTransformer(
    "all-MiniLM-L6-v2"
)


print(
    "Embedding model loaded successfully."
)


# ============================================================
# CONNECT TO CHROMADB
# ============================================================

print()
print("========================================")
print("Connecting to ChromaDB...")
print("========================================")


chroma_client = chromadb.PersistentClient(

    path="./chroma_db"
)


try:

    collection = chroma_client.get_collection(

        name="vastra_knowledge"

    )

except Exception:

    raise RuntimeError(
        "ChromaDB collection 'vastra_knowledge' "
        "does not exist. Run ingest.py first."
    )


print(
    "ChromaDB connected successfully."
)

print(
    "Documents available:",
    collection.count()
)


# ============================================================
# HOME ENDPOINT
# ============================================================

@app.get("/")
def home():

    return {

        "status": "success",

        "service": "Vastra RAG API",

        "message":
            "Vastra RAG service is running",

        "documents":
            collection.count()

    }


# ============================================================
# HEALTH ENDPOINT
# ============================================================

@app.get("/health")
def health():

    return {

        "status": "healthy",

        "chromadb":
            "connected",

        "documents":
            collection.count()

    }


# ============================================================
# RETRIEVE DOCUMENTS
# ============================================================

def retrieve_documents(
    question: str,
    top_k: int = 3
):

    # --------------------------------------------------------
    # Convert question into vector
    # --------------------------------------------------------

    query_embedding = (

        embedding_model

        .encode(question)

        .tolist()

    )


    # --------------------------------------------------------
    # Search ChromaDB
    # --------------------------------------------------------

    results = collection.query(

        query_embeddings=[
            query_embedding
        ],

        n_results=top_k,

        include=[
            "documents",
            "metadatas",
            "distances"
        ]

    )


    documents = results.get(
        "documents",
        [[]]
    )[0]


    metadatas = results.get(
        "metadatas",
        [[]]
    )[0]


    distances = results.get(
        "distances",
        [[]]
    )[0]


    return (
        documents,
        metadatas,
        distances
    )


# ============================================================
# BUILD CONTEXT
# ============================================================

def build_context(
    documents,
    metadatas
):

    context_parts = []


    for index, document in enumerate(
        documents
    ):

        metadata = (

            metadatas[index]

            if index < len(metadatas)

            else {}

        )


        source = metadata.get(

            "source",

            "Vastra Knowledge Base"

        )


        category = metadata.get(

            "category",

            "General"

        )


        context_parts.append(

            f"""
SOURCE: {source}

CATEGORY: {category}

DOCUMENT:
{document}
""".strip()

        )


    return "\n\n".join(
        context_parts
    )


# ============================================================
# ASK ENDPOINT
# ============================================================

@app.post("/ask")
def ask_question(
    request: QuestionRequest
):

    question = request.question.strip()


    # --------------------------------------------------------
    # Validate
    # --------------------------------------------------------

    if not question:

        raise HTTPException(

            status_code=400,

            detail="Question cannot be empty."

        )


    print()
    print("========================================")
    print("NEW RAG QUESTION")
    print("========================================")
    print(
        "Question:",
        question
    )


    try:

        # ====================================================
        # STEP 1
        # Retrieve relevant documents
        # ====================================================

        (
            documents,
            metadatas,
            distances

        ) = retrieve_documents(

            question,

            top_k=3

        )


        if not documents:

            return {

                "question": question,

                "answer":
                    "I couldn't find relevant "
                    "information in the Vastra "
                    "knowledge base.",

                "sources": []

            }


        print(
            "Retrieved documents:",
            len(documents)
        )


        # ====================================================
        # STEP 2
        # Build context
        # ====================================================

        context = build_context(

            documents,

            metadatas

        )


        # ====================================================
        # STEP 3
        # Send context + question to Gemini
        # ====================================================

        answer = generate_answer(

            question,

            context

        )


        # ====================================================
        # STEP 4
        # Prepare source information
        # ====================================================

        sources = []


        for index in range(
            len(documents)
        ):

            metadata = (

                metadatas[index]

                if index < len(metadatas)

                else {}

            )


            sources.append({

                "source":
                    metadata.get(
                        "source",
                        "Vastra Knowledge Base"
                    ),

                "category":
                    metadata.get(
                        "category",
                        "General"
                    ),

                "distance":
                    distances[index]
                    if index < len(distances)
                    else None

            })


        # ====================================================
        # STEP 5
        # Return answer
        # ====================================================

        return {

            "question": question,

            "answer": answer,

            "sources": sources

        }


    except Exception as error:

        print()
        print(
            "RAG ERROR:",
            str(error)
        )


        raise HTTPException(

            status_code=500,

            detail=
                "RAG processing failed."

        )