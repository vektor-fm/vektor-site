"""strip_har.py: make a HAR safe and small before any AI (or git) sees it.

    python strip_har.py site.har            -> writes site.clean.har and prints the data calls it kept

What it does (Python standard library only, nothing is sent anywhere):
  - keeps only the data calls: Fetch/XHR requests and JSON responses (drops pages, images, fonts, map tiles,
    and analytics beacons)
  - removes every cookie, Set-Cookie, Authorization and API-key style header
  - replaces secret-looking values (token, key, api_key, auth, session, sig, password...) with REDACTED, in URLs,
    headers (including HTTP/2's :path), form data and response bodies
  - trims each response body to its first 4,000 characters (enough to see the shape of the data)

Chrome's "Export HAR (sanitized)" already drops Cookie, Set-Cookie and Authorization headers, but NOT tokens
inside URLs (the USGS map page itself loads an ArcGIS map style with ?token=... in the URL). Run this anyway.
Still read the clean file before you share it: no filter catches every secret.
From @vektor.fm, free to use and change.
"""
import json
import re
import sys
from urllib.parse import parse_qsl, urlencode, urlsplit, urlunsplit

SECRET_HEADERS = {"cookie", "set-cookie", "authorization", "proxy-authorization", "x-api-key", "api-key",
                  "x-auth-token", "x-csrf-token", "x-xsrf-token", "x-amz-security-token"}
SECRET_NAME = re.compile(r"token|key|secret|passw|auth|session|sig|signature|credential|jwt|bearer", re.I)
BODY_LIMIT = 4000
URL_SECRET = re.compile(r"([?&;](?:[\w.-]*(?:token|key|secret|passw|auth|session|sig)[\w.-]*)=)[^&#\s\"']+", re.I)
BINARY = ("image/", "font/", "audio/", "video/", "application/octet-stream", "application/x-protobuf",
          "application/vnd.mapbox-vector-tile", "application/wasm")
TRACKERS = ("google-analytics.com", "googletagmanager.com", "doubleclick.net", "facebook.com/tr", "segment.io",
            "hotjar.com", "clarity.ms", "sentry.io", "newrelic.com", "nr-data.net")


def scrub(text):
    """Redact secret-looking name=value pairs inside any string (pseudo-headers like :path, referers, bodies)."""
    return URL_SECRET.sub(r"\1REDACTED", text) if isinstance(text, str) else text


def clean_url(url):
    parts = urlsplit(url)
    q = [(k, "REDACTED" if SECRET_NAME.search(k) else v) for k, v in parse_qsl(parts.query, keep_blank_values=True)]
    return urlunsplit(parts._replace(query=urlencode(q, safe=",:/")))


def is_data_call(e):
    kind = (e.get("_resourceType") or "").lower()
    mime = (e.get("response", {}).get("content", {}).get("mimeType") or "").lower()
    url = e["request"]["url"].lower()
    if any(t in url for t in TRACKERS) or mime.startswith(BINARY) or url.endswith(".html") or ".html?" in url:
        return False
    return kind in ("xhr", "fetch") or "json" in mime


def clean_entry(e):
    req, res = e["request"], e["response"]
    req["url"] = clean_url(req["url"])
    for side in (req, res):
        side["headers"] = [{**h, "value": scrub(h["value"])} for h in side.get("headers", [])
                           if h["name"].lower() not in SECRET_HEADERS and not SECRET_NAME.search(h["name"])]
        side["cookies"] = []
    req["queryString"] = [{"name": q["name"], "value": "REDACTED" if SECRET_NAME.search(q["name"]) else q["value"]}
                          for q in req.get("queryString", [])]
    post = req.get("postData")
    if post:
        post["params"] = [{**p, "value": "REDACTED"} if SECRET_NAME.search(p.get("name", "")) else p
                          for p in post.get("params", [])]
        text = post.get("text") or ""
        post["text"] = re.sub(r'("?[\w-]*(?:token|key|secret|passw|auth|session)[\w-]*"?\s*[:=]\s*)("[^"]*"|[^&,}\s]+)',
                              r'\1"REDACTED"', text, flags=re.I)[:BODY_LIMIT]
    content = res.get("content", {})
    content["text"] = scrub(content.get("text"))
    if isinstance(content.get("text"), str) and len(content["text"]) > BODY_LIMIT:
        content["text"] = content["text"][:BODY_LIMIT] + "...[trimmed by strip_har.py]"
    for k in [k for k in e if k.startswith("_") and k != "_resourceType"]:
        del e[k]
    return e


def main():
    if len(sys.argv) != 2:
        sys.exit("usage: python strip_har.py site.har")
    src = sys.argv[1]
    with open(src, encoding="utf-8") as f:
        har = json.load(f)
    entries = har["log"]["entries"]
    kept = [clean_entry(e) for e in entries if is_data_call(e)]
    har["log"]["entries"] = kept
    out = re.sub(r"\.har$", "", src, flags=re.I) + ".clean.har"
    with open(out, "w", encoding="utf-8") as f:
        json.dump(har, f, indent=1)
    print(f"{src}: {len(entries)} requests in, {len(kept)} data calls kept -> {out}")
    seen = {}
    for e in kept:
        u = urlsplit(e["request"]["url"])
        key = (e["request"]["method"], u.netloc + u.path)
        seen[key] = seen.get(key, 0) + 1
    for (method, path), n in sorted(seen.items(), key=lambda kv: kv[0][1]):
        print(f"  {method:6} {path}" + (f"  (x{n})" if n > 1 else ""))
    print("Cookies, auth headers and secret-looking values removed. Read the file once before you share it.")


if __name__ == "__main__":
    main()
