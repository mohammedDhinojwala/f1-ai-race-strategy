# src/simulation/track_config.py

# A simple dictionary holding the static rules for each track.
# We can add all 24 tracks here later.

TRACKS = {
    "Bahrain": {
        "total_laps": 57,
        "pit_loss": 21.8,       # Seconds lost in the pit lane
        "base_lap_time": 95.0   # Baseline pace in seconds (approx)
    },
    "Monaco": {
        "total_laps": 78,
        "pit_loss": 19.2,
        "base_lap_time": 75.5
    },
    "Silverstone": {
        "total_laps": 52,
        "pit_loss": 18.7,
        "base_lap_time": 88.0
    }
}

def get_track(track_name):
    """Returns the config for a specific track."""
    if track_name not in TRACKS:
        raise ValueError(f"Track '{track_name}' not found in config.")
    return TRACKS[track_name]