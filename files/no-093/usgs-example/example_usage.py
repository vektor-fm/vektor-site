from api_client import ApiError, latest_earthquakes

try:
    quakes = latest_earthquakes(min_magnitude=2.5, hours=24, limit=10)
except ApiError as e:
    raise SystemExit(f"Error: {e}")

print(f"{'Mag':>4}  {'Time (UTC)':<17}  {'Tsunami':<7}  Place")
for q in quakes:
    print(f"{q.magnitude:>4.1f}  {q.time:%Y-%m-%d %H:%M}  {'YES' if q.tsunami else 'no':<7}  {q.place}")
print(f"({len(quakes)} shown)")
