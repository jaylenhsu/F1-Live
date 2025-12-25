"""Compare position calculations between original and our version."""
import pickle

# Load original working data
with open("/Users/jaylenhsu/Desktop/Internships/Projects/f1-race-replay/computed_data/2025_Season_Round_24:_Abu_Dhabi_Grand_Prix_-_Race_race_telemetry.pkl", "rb") as f:
    original_data = pickle.load(f)
    original_frames = original_data['frames']

# Check frames around lap 2 completion
print("Looking for lap transitions in original data...")
for i in range(2500, 2600):
    frame = original_frames[i]
    if frame['lap'] >= 2:
        # Found lap 2, check surrounding frames
        print(f"\n=== ORIGINAL DATA - Lap transition around frame {i} ===")
        for j in range(max(0, i-5), min(len(original_frames), i+10)):
            f = original_frames[j]
            print(f"\nFrame {j}, t={f['t']:.1f}s, leader_lap={f['lap']}")
            drivers = f['drivers']

            # Show top 5 with their dist values
            sorted_drivers = sorted(drivers.items(), key=lambda x: x[1]['position'])[:5]
            for code, data in sorted_drivers:
                print(f"  P{data['position']}: {code:3s} - dist={data['dist']:8.1f}m, lap={data['lap']}")
        break

# Now check if our version has computed data
try:
    with open("/Users/jaylenhsu/Desktop/Internships/Projects/f1-race-replay copy/backend/computed_data/2025_Season_Round_24:_Abu_Dhabi_Grand_Prix_-_Race_race_telemetry.pkl", "rb") as f:
        our_data = pickle.load(f)
        our_frames = our_data['frames']

        print(f"\n\n=== OUR DATA - Same time period ===")
        # Find similar frame by time
        target_time = original_frames[2548]['t']

        for i, frame in enumerate(our_frames):
            if abs(frame['t'] - target_time) < 1.0:
                for j in range(max(0, i-5), min(len(our_frames), i+10)):
                    f = our_frames[j]
                    print(f"\nFrame {j}, t={f['t']:.1f}s, leader_lap={f['lap']}")
                    drivers = f['drivers']

                    sorted_drivers = sorted(drivers.items(), key=lambda x: x[1]['position'])[:5]
                    for code, data in sorted_drivers:
                        print(f"  P{data['position']}: {code:3s} - dist={data['dist']:8.1f}m, lap={data['lap']}")
                break

except FileNotFoundError:
    print("\n\nOur computed data not found yet. Run the backend first to generate it.")
