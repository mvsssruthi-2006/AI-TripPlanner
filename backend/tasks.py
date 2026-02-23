from crewai import Task

class TravelTasks:

    def destination_task(self, agent, destination):
        return Task(
            agent=agent,
            description=f"List 3 famous attractions in {destination}. Keep it short.",
            expected_output="3 bullet points with attraction names"
        )

    def hotel_task(self, agent, destination):
        return Task(
            agent=agent,
            description=f"Suggest 3 good hotels in {destination} with price range.",
            expected_output="3 bullet points with hotel names and prices"
        )
