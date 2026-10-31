`api_client.py` uses only the standard library and the one earthquake call found in the HAR (USGS 2.5_day GeoJSON feed, no login).
`fetch_feed(timeout)` returns the raw feed (magnitude 2.5+, past 24 hours); it raises `ApiError` on any server or network error.
`latest_earthquakes(min_magnitude, hours, limit, timeout)` returns `Quake` objects (magnitude, place, UTC time, tsunami flag, url), newest first.
Limit: the HAR shows only this fixed feed, so min magnitude and time window are filters applied client-side within 2.5+ / 24 h.
Example: `py -3.12 -c "from api_client import latest_earthquakes as l; print(l(min_magnitude=4.5, hours=6, limit=5))"`
