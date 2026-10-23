# create_embeddings.py

import requests
from bs4 import BeautifulSoup
from utils import split_text, create_faiss_index

def fetch_opendsa_content():
    urls = [
        "https://opendsa-server.cs.vt.edu/ODSA/Books/CS3/html/ListArray.html",
        "https://opendsa-server.cs.vt.edu/ODSA/Books/CS3/html/AnalProgram.html",
        "https://opendsa-server.cs.vt.edu/ODSA/Books/CS3/html/ListLinked.html"
    ]
    pages = []
    for url in urls:
        resp = requests.get(url)
        if resp.status_code != 200:
            raise RuntimeError(f"❌ Failed to fetch {url}: {resp.status_code}")
        text = BeautifulSoup(resp.text, "html.parser").get_text()
        pages.append({"source": url, "text": text})
    return pages

if __name__ == "__main__":
    docs = []
    for page in fetch_opendsa_content():
        # split_text now takes optional metadata
        chunks = split_text(page["text"], metadata={"source": page["source"]})
        docs.extend(chunks)

    create_faiss_index(docs)
    print("✅ FAISS index built from OpenDSA CS3 modules.")
