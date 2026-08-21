import os

from dotenv import load_dotenv
from google import genai


# ============================================================
# ENVIRONMENT
# ============================================================

load_dotenv()

GEMINI_API_KEY = os.getenv("GEMINI_API_KEY")

GEMINI_MODEL = os.getenv(
    "GEMINI_MODEL",
    "gemini-3.6-flash"
)


if not GEMINI_API_KEY:
    raise ValueError(
        "GEMINI_API_KEY is not configured in .env"
    )


# ============================================================
# GEMINI CLIENT
# ============================================================

client = genai.Client(
    api_key=GEMINI_API_KEY
)


# ============================================================
# GENERATE ANSWER
# ============================================================

def generate_answer(
    question: str,
    context: str
):

    prompt = f"""
You are Vastra AI, an intelligent assistant
for the Vastra Handloom Platform.

Your job is to answer the user's question
using the retrieved Vastra knowledge.

IMPORTANT RULES:

1. Use the retrieved context as the primary
   source of information.

2. Do not invent facts.

3. Do not use outside knowledge when the
   retrieved context is insufficient.

4. If the context does not contain enough
   information to answer the question, say:

   "I couldn't find enough information in
   the Vastra knowledge base to answer that."

5. Give a clear and useful answer.

6. Do not mention ChromaDB, embeddings,
   vector databases, retrieval pipelines,
   prompts, or internal implementation
   unless the user specifically asks about
   the technical implementation.

7. If multiple retrieved documents are
   relevant, combine them carefully.

------------------------------------------------------------
RETRIEVED VASTRA KNOWLEDGE
------------------------------------------------------------

{context}

------------------------------------------------------------
USER QUESTION
------------------------------------------------------------

{question}

------------------------------------------------------------
ANSWER
------------------------------------------------------------
"""


    response = client.models.generate_content(

        model=GEMINI_MODEL,

        contents=prompt
    )


    if not response.text:

        return (
            "I couldn't generate an answer "
            "from the Vastra knowledge base."
        )


    return response.text