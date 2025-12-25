"""Analyze race_progress values at lap transitions."""
import pickle
import numpy as np

# Load our computed data
try:
    with open("/Users/jaylenhsu/Desktop/Internships/Projects/f1-race-replay copy/backend/computed_data/2025_Season_Round_24:_Abu_Dhabi_Grand_Prix_-_Race_race_telemetry.pkl", "rb") as f:
        our_data = pickle.load(f)
        our_frames = our_data['frames']

        print(f"Total frames in our data: {len(our_frames)}")

        # Find lap transition (around t=102s based on original)
        for i, frame in enumerate(our_frames):
            if 101.5 < frame['t'] < 102.5:
                print(f"\n=== Frame {i}, t={frame['t']:.1f}s, leader_lap={frame['lap']} ===")
                drivers = frame['drivers']

                # Sort by position to see the order
                sorted_drivers = sorted(drivers.items(), key=lambda x: x[1]['position'])

                for code, data in sorted_drivers[:8]:
                    race_prog = data.get('race_progress', 'N/A')
                    if race_prog != 'N/A':
                        race_prog = f"{race_prog:8.1f}m"
                    print(f"  P{data['position']}: {code:3s} - dist={data['dist']:8.1f}m, race_prog={race_prog}, lap={data['lap']}")

except FileNotFoundError:
    print("Our computed data not found. Run the backend first.")
