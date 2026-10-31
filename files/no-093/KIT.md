# The ENDPOINT kit: turn a web page's own data calls into a Python client

No extra tool to install: Chrome (or any Chromium browser) and Claude Code. In our test run the Claude step (4) took 48 seconds; recording and exporting were not timed with a person.
Tested end to end on 2026-10-31 on the USGS Latest Earthquakes map (worked example below).

**Only for sites whose data you are allowed to use.** Read the site's terms first: many sites ban automated access
(LinkedIn's User Agreement §8.2 does, for one). Public data feeds and your own apps are the safe cases.

## 1. Record

Open the page in Chrome. Press F12 (Mac: Cmd+Option+I), go to the **Network** tab, tick **Preserve log**, and click the
**Fetch/XHR** filter. Reload the page, then do the thing whose data you want: search, scroll, open a list, and change
every filter you care about, so each version of the call ends up in the recording (the client can only use what you
recorded).

## 2. Export, sanitized

Right-click any request in the list and choose **Save all listed as HAR (sanitized)** (or use **Export HAR
(sanitized)...** in the panel's action bar). Sanitized is Chrome's default: it leaves out the `Cookie`, `Set-Cookie` and
`Authorization` headers. Never turn on "Allow to generate HAR with sensitive data" for this.

## 3. Strip what sanitized misses (optional, recommended)

Sanitized does not remove tokens written into URLs or bodies. Put `strip_har.py` next to the file and run:

```
python strip_har.py site.har
```

It writes `site.clean.har` (data calls only; cookies, auth headers and secret-looking values such as `token=`, `key=`,
`session=` replaced with `REDACTED`) and lists the calls it kept. Standard library only, nothing is sent anywhere. Skim
the clean file once before you share it: no filter catches every secret.

## 4. Paste the prompt into Claude Code

Open Claude Code in an empty folder that holds `site.clean.har`, fill in the four `<...>` parts and paste:

```
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
```

**What you get:** `api_client.py`, `example_usage.py` and a short `README.md`, plus the real output of one run.
**Keep it out of git if it uses a login:** a client for a logged-in site carries your session through an environment
variable; never commit `.har` files or a `.env`, and add both to `.gitignore`.

## Worked example: USGS Latest Earthquakes (public domain data, no login)

Page: earthquake.usgs.gov/earthquakes/map. Recorded 2026-10-31 01:34 (Zurich): 123 requests while the map loaded;
`strip_har.py` kept 39 data calls, and one of them carries the earthquakes:

```
GET earthquake.usgs.gov/earthquakes/feed/v1.0/summary/2.5_day.geojson
```

The other 38 are map plumbing (ArcGIS tiles, styles, the plate-boundary layer). One of those, the ArcGIS basemap style,
had an access token in its URL: Chrome's sanitized export would have kept it; `strip_har.py` replaced it with `REDACTED`.

The prompt above, filled in as "...while I opened the Latest Earthquakes map. I want ... the latest earthquakes, with
magnitude, place, time and whether there was a tsunami flag, and I want to choose the minimum magnitude and the time
window", gave in 48 seconds a stdlib-only `api_client.py` with `latest_earthquakes(min_magnitude, hours, limit)` and this
real output:

```
$ python example_usage.py
 Mag  Time (UTC)         Tsunami  Place
 3.0  2026-10-30 23:06  no       74 km SSE of McGrath, Alaska
 3.1  2026-10-30 22:53  no       54 km WNW of Anchor Point, Alaska
 4.6  2026-10-30 22:46  no       33 km NE of Mazo Cruz, Peru
 4.3  2026-10-30 22:23  no       south of the Fiji Islands
 4.7  2026-10-30 22:14  no       222 km NW of Port-Olry, Vanuatu
 4.4  2026-10-30 21:15  no       36 km E of Koseda, Japan
 4.1  2026-10-30 20:54  no       73 km SSW of Calama, Chile
 4.4  2026-10-30 20:26  no       37 km S of Nishinoomote, Japan
 2.8  2026-10-30 20:14  no       56 km NNW of Petersville, Alaska
 2.5  2026-10-30 19:29  no       63 km WNW of Happy Valley, Alaska
(10 shown)
```

The one lesson from the run: the recording only had the map's default feed (magnitude 2.5+, past day), so Claude, told
not to guess endpoints, filtered magnitude and time inside that feed and said so. Change the map's settings while you
record (step 1) and the client gets the other feeds too. Data: U.S. Geological Survey (public domain; credit USGS).

## The automated version

The film's tool, Reverse API Engineer (github.com/kalil0321/reverse-api-engineer, MIT), drives the browser for you:
its README's flow is that an AI agent (or you) visits the site, the traffic is captured to a HAR file, and a model writes
the client from it. In our one run of it (2026-10-31, same USGS map) its agent skipped the page and went straight to the
earthquake feed it already knew, so its recording held a single request. Its generator is told to hardcode the credentials it finds in the traffic, so review what it writes
and keep it out of git.

From @vektor.fm. Free to use and change.
