from agents import DestinationAgent, HotelAgent

class TripPlanner:
    def run(self, destination):
        dest = DestinationAgent().run(destination)
        hotel = HotelAgent().run(destination)
        return f"### Attractions\n{dest}\n\n### Hotels\n{hotel}"
