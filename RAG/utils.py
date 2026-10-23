# utils.py
from langchain_community.embeddings import HuggingFaceEmbeddings
from langchain_community.vectorstores import FAISS
from langchain.text_splitter import RecursiveCharacterTextSplitter
from langchain.text_splitter import RecursiveCharacterTextSplitter

# Use a small, free sentence-transformers model
EMBEDDING_MODEL = HuggingFaceEmbeddings(
    model_name="sentence-transformers/all-MiniLM-L6-v2"
)

def split_text(content: str):
    splitter = RecursiveCharacterTextSplitter(
        chunk_size=1000,
        chunk_overlap=150
    )
    return splitter.create_documents([content])

def create_faiss_index(chunks):
    db = FAISS.from_documents(chunks, EMBEDDING_MODEL)
    db.save_local("embeddings/faiss_index")

def split_text(content, metadata: dict = None):
    splitter = RecursiveCharacterTextSplitter(chunk_size=1000, chunk_overlap=150)
    # pass the same metadata into every chunk
    return splitter.create_documents([content], metadatas=[metadata or {}])