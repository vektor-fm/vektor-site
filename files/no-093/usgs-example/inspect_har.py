import json, sys
from urllib.parse import urlsplit, parse_qsl
har = json.load(open(sys.argv[1], encoding="utf-8"))
for i, e in enumerate(har["log"]["entries"]):
    r, s = e["request"], e["response"]
    mt = s["content"].get("mimeType", "")
    if not any(k in mt.lower() for k in ("json", "csv", "xml")):
        continue
    u = urlsplit(r["url"])
    q = [k for k, _ in parse_qsl(u.query)]
    print(i, r["method"], f"{u.scheme}://{u.netloc}{u.path}", s["status"], mt, "query keys:", q)
    t = s["content"].get("text")
    if t and "json" in mt.lower():
        try:
            d = json.loads(t)
            print("   fields:", list(d)[:15] if isinstance(d, dict) else f"list[{len(d)}]")
        except Exception as ex:
            print("   (unparsable)", ex)
    hs = [h["name"] for h in r["headers"] if h["name"].lower() in ("cookie","authorization","x-api-key")]
    if hs: print("   sensitive headers:", hs)
