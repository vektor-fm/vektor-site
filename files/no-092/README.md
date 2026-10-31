# shrink.py: how small would YOUR vector search get with turbovec?
Install (tested on Python 3.12): `pip install turbovec numpy` (for a FAISS index, also `pip install faiss-cpu`)
Run: `python shrink.py my_embeddings.npy` or `python shrink.py my_index.faiss`. Takes seconds; nothing leaves your machine.
It prints your vectors' memory as float32 vs a turbovec 4-bit and 2-bit index, plus recall@1 and recall@10 against exact search, using 100 of your own vectors as test queries.
Works with: any 2-D float array saved as .npy (OpenAI, Cohere, sentence-transformers... `np.save("emb.npy", vectors)`), FAISS Flat and IVF-Flat indexes. Tested 2026-10-31 on Windows 11, Python 3.12, turbovec 1.1.2, faiss-cpu 1.15.1.
turbovec is github.com/RyanCodrai/turbovec (MIT, built on Google Research's TurboQuant); shrink.py is from @vektor.fm, free to use and change.
