from agents.destination import DestinationAgent
from agents.accommodation import AccommodationAgent
from agents.transport import TransportAgent
from agents.itinerary import ItineraryAgent
from agents.budget import BudgetAgent
from agents.explainability import ExplainabilityAgent
from agents.budget_guard import BudgetGuardAgent

class TripOrchestrator:
    def __init__(self, user_input: dict):
        # 🔥 SINGLE SOURCE OF TRUTH
        self.context = {
            "user_profile": user_input
        }

    def run(self):
        try:
            self.run_destination_agent()

            if not self.context.get("destination"):
                return {"error": "Destination could not be resolved"}

            self.run_itinerary_agent()      # itinerary BEFORE hotels (important)
            self.run_accommodation_agent() # hotels depend on itinerary
            self.run_transport_agent()
            self.run_budget_agent()
            self.run_budget_guard_agent()
            self.run_explainability_agent()

            return self.context

        except Exception as e:
            return {"error": str(e)}

    # ---------------- AGENTS ---------------- #

    def run_destination_agent(self):
        agent = DestinationAgent()
        self.context["destination"] = agent.run(self.context)

    def run_itinerary_agent(self):
        agent = ItineraryAgent()
        self.context["itinerary"] = agent.run(self.context)

    # In TripOrchestrator class, add this method or modify existing ones:

    def run_accommodation_agent(self):
        print("🔵 RUNNING ACCOMMODATION AGENT")
        agent = AccommodationAgent()
        self.context["hotels"] = agent.run(self.context)
        print(f"🔵 HOTELS IN CONTEXT: {bool(self.context.get('hotels'))}")
        if self.context.get('hotels'):
            print(f"🔵 HOTEL AREAS: {list(self.context['hotels'].keys())}")

    def run_transport_agent(self):
        agent = TransportAgent()
        self.context["transport"] = agent.run(self.context)

    def run_budget_agent(self):
        agent = BudgetAgent()
        self.context["budget"] = agent.run(self.context)

    def run_budget_guard_agent(self):
        agent = BudgetGuardAgent()
        self.context["budget_status"] = agent.run(self.context)

    def run_explainability_agent(self):
        agent = ExplainabilityAgent()
        self.context["explanation"] = agent.run(self.context)