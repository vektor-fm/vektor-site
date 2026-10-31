"""Minimal client for the one earthquake call seen in the HAR (standard library only).

HAR evidence: GET https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/2.5_day.geojson
(no query string, no cookies, no token). That feed is fixed: magnitude 2.5+, past 24 hours.
Min magnitude and time window are therefore applied here, on the client, inside that range.
"""
from __future__ import annotations

import json
import urllib.error
import urllib.request
from dataclasses import dataclass
from datetime import datetime, timedelta, timezone
from typing import Optional

FEED_URL = "https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/2.5_day.geojson"
USER_AGENT = "har-quake-client/1.0 (plain Python urllib)"
# If you loop over calls, sleep at least this long between them and stop on the first error.
MIN_SECONDS_BETWEEN_REQUESTS = 1.0


class ApiError(Exception):
    """The server answered with an error, or the answer was not usable."""


@dataclass
class Quake:
    magnitude: Optional[float]
    place: str
    time: datetime  # UTC
    tsunami: bool
    url: str


def fetch_feed(timeout: float = 15.0) -> dict:
    """GET the 2.5_day GeoJSON feed and return the parsed JSON (FeatureCollection)."""
    req = urllib.request.Request(FEED_URL, headers={"User-Agent": USER_AGENT, "Accept": "application/json"})
    try:
        with urllib.request.urlopen(req, timeout=timeout) as resp:
            return json.loads(resp.read().decode("utf-8"))
    except urllib.error.HTTPError as e:
        hint = " (rate limited, stop and retry later)" if e.code == 429 else ""
        raise ApiError(f"Server answered HTTP {e.code} {e.reason} for {FEED_URL}{hint}") from e
    except urllib.error.URLError as e:
        raise ApiError(f"Could not reach {FEED_URL}: {e.reason}") from e
    except (TimeoutError, json.JSONDecodeError) as e:
        raise ApiError(f"Bad or timed-out response from {FEED_URL}: {e}") from e


def latest_earthquakes(
    min_magnitude: float = 2.5,
    hours: float = 24.0,
    limit: Optional[int] = None,
    timeout: float = 15.0,
) -> list[Quake]:
    """Latest earthquakes, newest first.

    min_magnitude: keep quakes at or above this (feed floor is 2.5, lower values add nothing).
    hours: keep quakes from the last N hours (feed covers at most the past 24 h).
    limit: return at most this many (None = all).
    """
    data = fetch_feed(timeout=timeout)
    cutoff = datetime.now(timezone.utc) - timedelta(hours=hours)
    out: list[Quake] = []
    for f in data.get("features", []):
        p = f.get("properties", {})
        mag = p.get("mag")
        if p.get("time") is None or mag is None or mag < min_magnitude:
            continue
        t = datetime.fromtimestamp(p["time"] / 1000, tz=timezone.utc)
        if t < cutoff:
            continue
        out.append(Quake(mag, p.get("place") or "", t, bool(p.get("tsunami")), p.get("url") or ""))
    out.sort(key=lambda q: q.time, reverse=True)
    return out[:limit] if limit else out
