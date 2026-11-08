"""shrink.py: how small would YOUR vector search get with turbovec, and what does it cost in accuracy?

Point it at your own embeddings. It builds turbovec indexes (4-bit and 2-bit) from them, then prints
  - memory: your vectors as float32 vs each turbovec index
  - accuracy: recall@1 and recall@10 against exact (brute-force float32) search, on queries taken
    from your own data
Nothing leaves your machine.

Install:  pip install turbovec numpy          (for a FAISS index also: pip install faiss-cpu)
Run:      python shrink.py my_embeddings.npy
          python shrink.py my_index.faiss
Options:  --bits 4 2        bit widths to try (default: 4 2)
          --queries 100     how many of your vectors to hold out as test queries (default: 100)
          --metric cosine   cosine (normalise rows, the usual choice for text embeddings) or dot
          --save my.tv      also write the 4-bit index to disk, ready for TurboQuantIndex.load()

How the test works: the --queries rows are picked at random (seed 0) and left OUT of the index, so a
query never finds itself. For each query, exact search over the remaining float32 vectors gives the
true top 10; turbovec's top 10 is compared with it.
  recall@1  = share of queries where turbovec's first result is the true first result
  recall@10 = share of the true top 10 that turbovec also returns in its top 10
"Memory" for turbovec is the index's serialized size (what it holds for your vectors); float32 is
rows x dim x 4 bytes.

turbovec: github.com/RyanCodrai/turbovec (MIT), built on Google Research's TurboQuant.
shrink.py: from @vektor.fm, free to use and change.
"""
import argparse
import sys
import time

import numpy as np

try:
    import turbovec
    from turbovec import TurboQuantIndex
except ImportError:
    sys.exit("turbovec is not installed. Run:  pip install turbovec numpy")

CHUNK = 20_000
K = 10


def fmt_bytes(b):
    for unit, size in (("GB", 1e9), ("MB", 1e6), ("KB", 1e3)):
        if b >= size:
            return f"{b / size:,.1f} {unit}"
    return f"{b:,} B"


def load_vectors(path):
    """Return (array-like of shape (n, dim), description, size of the source index in bytes or None)."""
    low = path.lower()
    if low.endswith(".npy"):
        x = np.load(path, mmap_mode="r")  # memory-mapped: read in chunks, never copied whole
        if x.ndim != 2:
            sys.exit(f"{path}: expected a 2-D array (rows x dim), got shape {x.shape}")
        return x, f".npy, dtype {x.dtype}", None
    if low.endswith((".faiss", ".index", ".idx", ".bin")):
        try:
            import faiss
        except ImportError:
            sys.exit("This looks like a FAISS index. Run:  pip install faiss-cpu")
        index = faiss.read_index(path)
        source_bytes = len(faiss.serialize_index(index))
        kind = type(index).__name__
        try:
            ivf = faiss.extract_index_ivf(index)  # IVF indexes need a direct map to hand vectors back
            ivf.make_direct_map()
        except Exception:
            pass
        try:
            x = index.reconstruct_n(0, index.ntotal)
        except Exception as e:
            sys.exit(f"FAISS {kind} cannot hand its vectors back ({e}).\n"
                     "Save the vectors you indexed instead:  np.save('emb.npy', vectors)  and run shrink.py on that.")
        note = f"FAISS {kind}, {index.ntotal:,} vectors"
        if "PQ" in kind or "SQ" in kind or "LSH" in kind:
            note += " (already compressed: the vectors read back are FAISS's approximations)"
        return x, note, source_bytes
    sys.exit(f"{path}: use a .npy file of embeddings or a FAISS index file (.faiss / .index)")


def prep(rows, metric):
    rows = np.ascontiguousarray(rows, dtype=np.float32)
    if metric == "cosine":
        norms = np.linalg.norm(rows, axis=1, keepdims=True)
        rows = rows / np.where(norms == 0, 1.0, norms)
        rows = np.ascontiguousarray(rows, dtype=np.float32)
    return rows


def main():
    ap = argparse.ArgumentParser(description="How small would your vector search get with turbovec?")
    ap.add_argument("path", help="embeddings .npy (rows x dim) or a FAISS index file")
    ap.add_argument("--bits", type=int, nargs="+", default=[4, 2], choices=[2, 4])
    ap.add_argument("--queries", type=int, default=100)
    ap.add_argument("--metric", choices=["cosine", "dot"], default="cosine")
    ap.add_argument("--seed", type=int, default=0)
    ap.add_argument("--save", help="write the 4-bit index to this path")
    a = ap.parse_args()

    t_start = time.perf_counter()
    x, desc, source_bytes = load_vectors(a.path)
    n, dim = x.shape
    nq = min(a.queries, n // 10)
    if nq < 1:
        sys.exit(f"Only {n} vectors: need at least 10 to hold some out as test queries.")
    print(f"shrink.py | turbovec {turbovec.__version__} | numpy {np.__version__} | Python {sys.version.split()[0]}")
    print(f"input: {a.path} ({desc})")
    print(f"vectors: {n:,} x {dim} dims | metric: {a.metric} | test queries held out: {nq}")

    rng = np.random.default_rng(a.seed)
    q_rows = np.sort(rng.choice(n, size=nq, replace=False))
    held = np.zeros(n, dtype=bool)
    held[q_rows] = True
    queries = prep(np.asarray(x[q_rows]), a.metric)

    indexes = {}
    for b in a.bits:
        try:
            indexes[b] = TurboQuantIndex(dim=dim, bit_width=b)
        except Exception as e:
            sys.exit(f"turbovec cannot build a {b}-bit index at dim {dim}: {e}")

    best_s = np.full((nq, K), -np.inf, dtype=np.float32)  # exact top-K so far
    best_i = np.full((nq, K), -1, dtype=np.int64)
    slot = 0
    print("building ...", flush=True)
    t_build = time.perf_counter()
    for start in range(0, n, CHUNK):
        stop = min(start + CHUNK, n)
        keep = ~held[start:stop]
        rows = prep(np.asarray(x[start:stop])[keep], a.metric)
        m = len(rows)
        if m == 0:
            continue
        s = queries @ rows.T  # exact float32 scores for this chunk
        cat_s = np.concatenate([best_s, s], axis=1)
        cat_i = np.concatenate([best_i, np.broadcast_to(np.arange(slot, slot + m), (nq, m))], axis=1)
        top = np.argpartition(-cat_s, K - 1, axis=1)[:, :K]
        best_s = np.take_along_axis(cat_s, top, axis=1)
        best_i = np.take_along_axis(cat_i, top, axis=1)
        for ix in indexes.values():
            ix.add(rows)
        slot += m
        del rows, s
    order = np.argsort(-best_s, axis=1)
    exact = np.take_along_axis(best_i, order, axis=1)  # true top-K, best first
    build_s = time.perf_counter() - t_build

    n_idx = slot
    f32 = n_idx * dim * 4
    print()
    print(f"MEMORY ({n_idx:,} vectors in the index)")
    print(f"  float32 (rows x dim x 4 bytes) {fmt_bytes(f32):>12}")
    if source_bytes is not None:
        print(f"  your FAISS index on disk       {fmt_bytes(source_bytes):>12}")
    results = []
    for b, ix in indexes.items():
        ix.prepare()
        size = len(ix.to_bytes())
        t = time.perf_counter()
        _, ids = ix.search(queries, k=K)
        search_ms = (time.perf_counter() - t) * 1000
        ids = np.asarray(ids)
        r1 = float(np.mean(ids[:, 0] == exact[:, 0]))
        r10 = float(np.mean([len(set(ids[q]) & set(exact[q])) / K for q in range(nq)]))
        in10 = int(sum(exact[q, 0] in set(ids[q]) for q in range(nq)))
        results.append((b, size, r1, r10, in10, search_ms))
        print(f"  turbovec {b}-bit                 {fmt_bytes(size):>12}   {f32 / size:.1f}x smaller")
    if source_bytes is not None and source_bytes < min(r[1] for r in results):
        print("  note: your FAISS index is already compressed and smaller than these. For a fair test, run")
        print("        shrink.py on the original float32 vectors (.npy) you built it from.")
    print()
    print(f"ACCURACY vs exact float32 search ({nq} of your own vectors as queries)")
    for b, size, r1, r10, in10, ms in results:
        print(f"  {b}-bit  recall@1 {r1:.2f}   recall@10 {r10:.2f}   "
              f"true top match inside turbovec's top 10: {in10}/{nq}   ({ms:.0f} ms for {nq} searches)")
    print()
    print(f"index build {build_s:.1f} s | total {time.perf_counter() - t_start:.1f} s")

    if a.save:
        if 4 in indexes:
            indexes[4].write(a.save)
            print(f"saved the 4-bit index to {a.save}  (load it with TurboQuantIndex.load('{a.save}'))")
            print("note: slot numbers follow your rows in order, minus the held-out query rows.")
        else:
            print("--save writes the 4-bit index: add 4 to --bits")


if __name__ == "__main__":
    main()
