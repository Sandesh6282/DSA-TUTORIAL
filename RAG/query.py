# query.py

from transformers import pipeline
from langchain_community.embeddings import HuggingFaceEmbeddings
from langchain_community.vectorstores import FAISS

# 1. Load retriever (allow pickle deserialization because it's your own index)
emb_model = HuggingFaceEmbeddings(model_name="sentence-transformers/all-MiniLM-L6-v2")
db = FAISS.load_local(
    "embeddings/faiss_index",
    emb_model,
    allow_dangerous_deserialization=True
)

# 2. Set up your local LLM pipeline
llm_pipe = pipeline(
    task="text2text-generation",
    model="google/flan-t5-small",
    max_length=256
)

def answer(question: str, k: int = 3):
    # 3. Retrieve top‑k chunks
    docs = db.similarity_search(question, k=k)
    context = "\n\n".join(d.page_content for d in docs)

    # 4. Build a prompt
    prompt = (
        "You are a helpful DSA tutor. "
        "Use the context below to answer the question. "
        "If it’s not in the context, say you don’t know.\n\n"
        f"Context:\n{context}\n\n"
        f"Question:\n{question}\n\n"
        "Answer:"
    )

    # 5. Generate
    out = llm_pipe(prompt)[0]["generated_text"]

    # 6. Print
    print("\n----- Answer -----\n")
    print(out.strip())
    print("\n----- Sources -----")
    for d in docs:
        src = d.metadata.get("source", "unknown")
        print("•", src)

if __name__ == "__main__":
    q = input("Ask a DSA question: ")
    answer(q)
