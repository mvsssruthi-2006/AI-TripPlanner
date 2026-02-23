from groq import Groq
import os
from dotenv import load_dotenv
import json

load_dotenv()

client = Groq(api_key=os.getenv("GROQ_API_KEY"))

class BudgetAgent:
    def run(self, context: dict) -> dict:
        """
        Estimates an approximate trip budget using
        accommodation, transport, and itinerary data.
        """

        hotels = context.get("hotels", {})
        transport = context.get("transport", {})
        itinerary = context.get("itinerary", {})

        prompt = f"""
You are a travel budget estimation assistant.

RULES:
1. Assume a 3-day trip.
2. Calculate TOTAL accommodation cost across all areas.
3. Do NOT break budget by area.
4. All fields MUST be plain strings.
5. Do NOT return nested objects.
6. Output ONLY valid JSON.
7. Example format:

{{
  "hotel_budget": "₹15000 - ₹25000",
  "transport_budget": "₹10000 - ₹20000",
  "daily_expenses": "₹5000 - ₹10000",
  "total_estimated_budget": "₹30000 - ₹55000",
  "notes": "Short reasoning"
}}
Hotel data:
{hotels}

Transport data:
{transport}

Itinerary:
{itinerary}

JSON output format:
{{
  "hotel_budget": "...",
  "transport_budget": "...",
  "daily_expenses": "...",
  "total_estimated_budget": "...",
  "notes": "..."
}}
"""

        response = client.chat.completions.create(
            model="llama-3.1-8b-instant",
            messages=[{"role": "user", "content": prompt}],
            max_tokens=200
        )

        try:
            return json.loads(response.choices[0].message.content)
        except Exception:
            return {
                "hotel_budget": "₹10000–15000",
        "transport_budget": "₹3000–5000",
        "daily_expenses": "₹2000/day",
        "total_estimated_budget": "₹20000–25000",
        "notes": "Estimated using fallback values"
            }