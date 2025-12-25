"""Debug race_progress values at the start of the race."""
import pickle

# Load our computed data
try:
    with open("/Users/jaylenhsu/Desktop/Internships/Projects/f1-race-replay copy/backend/computed_data/2025_Season_Round_24:_Abu_Dhabi_Grand_Prix_-_Race_race_telemetry.pkl", "rb") as f:
        data = pickle.load(f)

        # Check first frame
        frame = data['frames'][0]
        print(f"Frame 0, t={frame['t']:.1f}s, leader_lap={frame['lap']}")
        print("\nDrivers sorted by position:")

        drivers_list = [(code, ddata) for code, ddata in frame['drivers'].items()]
        drivers_list.sort(key=lambda x: x[1]['position'])

        for code, ddata in drivers_list:
            print(f"  P{ddata['position']:2d}: {code:3s} - dist={ddata['dist']:8.1f}m, lap={ddata['lap']}")

        print("\n" + "="*60)
        print("Drivers sorted by dist (descending) - what the order SHOULD be:")
        drivers_list.sort(key=lambda x: x[1]['dist'], reverse=True)

        for i, (code, ddata) in enumerate(drivers_list, 1):
            print(f"  Should be P{i:2d}: {code:3s} - dist={ddata['dist']:8.1f}m, actual_pos={ddata['position']}, lap={ddata['lap']}")

except FileNotFoundError:
    print("Computed data not found. Run the backend first.")
