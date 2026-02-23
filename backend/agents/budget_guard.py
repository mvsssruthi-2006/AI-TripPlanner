class BudgetGuardAgent:
    def run(self, context: dict) -> dict:
        user = context["user_profile"]
        budget_data = context.get("budget", {})

        user_budget = user.get("budget", 0)

        # Extract estimated total safely
        total_str = budget_data.get("total_estimated_budget", "")
        total_cost = 0

        try:
            total_cost = int(
                total_str.replace("₹", "")
                .replace(",", "")
                .split("–")[0]
            )
        except:
            total_cost = user_budget

        status = "within_budget"
        message = "Your trip comfortably fits within your budget."
        suggestions = []

        if total_cost > user_budget:
            status = "over_budget"
            message = "Your trip exceeds the selected budget."

            suggestions = [
                "Choose a lower hotel category",
                "Switch to train or bus instead of flight",
                "Reduce daily activities for a relaxed pace",
                "Decrease number of travel days"
            ]

        elif total_cost > user_budget * 0.9:
            status = "near_limit"
            message = "Your trip is close to the budget limit."

            suggestions = [
                "Monitor food and daily expenses",
                "Avoid peak-hour travel",
                "Prefer budget-friendly dining options"
            ]

        return {
            "status": status,
            "estimated_cost": f"₹{total_cost}",
            "user_budget": f"₹{user_budget}",
            "message": message,
            "suggestions": suggestions
        }