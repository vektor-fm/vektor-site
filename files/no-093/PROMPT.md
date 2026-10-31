I've put a HAR file in this folder: <FILE>.clean.har. It is my browser's recording of the site <SITE> while I <WHAT YOU DID ON THE PAGE>. I want a small Python client for the data I saw: <THE DATA YOU WANT, in plain words>.

Do this:
1. Read the HAR with a short script, not by opening the whole file. List every request that returned data (JSON, GeoJSON, CSV or XML): method, URL without its query values, status, and the top-level fields of the response. Tell me which one or two calls carry the data I asked for and why.
2. Write `api_client.py` using only the Python standard library (urllib, json): one function per useful call, with the parameters I would want to change (dates, filters, page, size) as arguments with sensible defaults, type hints, a timeout, and a clear error when the server answers with an error.
3. Write `example_usage.py` that calls the client for my data and prints the first 10 results as a readable table.
4. Run `example_usage.py` and show me the real output. If a call fails, fix it and run again.
5. Write a 5-line `README.md`: what each function does and one example call.

Rules:
- Only use calls that are in the HAR. Do not guess other endpoints.
- Never put cookies, tokens, API keys or session values into the code. If a call needs one, read it from an environment variable and tell me which one; if the HAR shows a redacted value, say so instead of inventing one.
- Set a plain User-Agent, wait at least 1 second between requests in any loop, and stop at the first rate-limit or error answer.
- Only for sites whose data I'm allowed to use. If the site's terms ban automated access, stop and tell me.
