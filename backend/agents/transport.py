from groq import Groq
import os
from dotenv import load_dotenv
from tools.search_tool import SearchTool
import json
import re

load_dotenv()
client = Groq(api_key=os.getenv("GROQ_API_KEY"))


def build_direct_booking_link(mode, origin, destination):
    origin = origin.replace(" ", "+")
    destination = destination.replace(" ", "+")

    if mode == "flight":
        return f"https://www.google.com/travel/flights?q={origin}+to+{destination}"
    if mode == "train":
        return "https://www.irctc.co.in/nget/train-search"
    if mode == "bus":
        return f"https://www.redbus.in/bus-tickets/{origin}-to-{destination}"
    if mode == "car":
        return f"https://www.google.com/maps/dir/{origin}/{destination}"

    return "#"


class TransportAgent:
    def run(self, context: dict) -> dict:
        user = context["user_profile"]

        origin = user["origin"]
        destination = context["destination"]["destination"]
        mode = user.get("transport_mode", "flight").lower()
        travelers = int(user.get("travelers", 1))
        purpose = user.get("purpose", "vacation")
        budget = int(user.get("budget", 0))

        # ------------------ PRICE SAFETY ------------------ #
        FALLBACK_PRICE = {
            "flight": "₹3000–6000",
            "train": "₹800–2000",
            "bus": "₹600–1500",
            "car": "₹4000–7000"
        }

        search_query = f"{mode} travel from {origin} to {destination} price duration India"
        search_data = SearchTool.search(search_query)

        # ------------------ PROMPT ------------------ #
        prompt = f"""
You are an Indian travel transport expert.

Suggest EXACTLY THREE {mode} options from {origin} to {destination}.

Rules:
- Providers must be realistic for India
- Price must be INR
- Each option must be complete
- Return ONLY JSON (no explanation)

Output format:
{{
  "mode": "{mode}",
  "options": [
    {{
      "name": "Provider name",
      "departure": "Morning / Afternoon / Night",
      "duration": "Xh Ym",
      "price": "₹xxxx–yyyy",
      "comfort": "Economy / AC / Sleeper",
      "recommended_for": "{purpose}",
      "reason": "Short practical reason"
    }}
  ]
}}

Search data:
{search_data}
"""

        try:
            response = client.chat.completions.create(
                model="llama-3.1-8b-instant",
                messages=[{"role": "user", "content": prompt}],
                max_tokens=400
            )

            data = json.loads(response.choices[0].message.content)
            options = data.get("options", [])

            # ------------------ HARD NORMALIZATION ------------------ #
            for opt in options:
                opt.setdefault("departure", "Flexible")
                opt.setdefault("duration", "Approximate")
                opt.setdefault("comfort", "Standard")
                opt.setdefault("recommended_for", purpose)
                opt.setdefault(
                    "reason",
                    "Popular and reliable option for this route"
                )

                price_text = opt.get("price", "")
                if not re.search(r"\d", price_text):
                    opt["price"] = FALLBACK_PRICE.get(mode, "₹2000–4000")

                opt["booking_link"] = build_direct_booking_link(
                    mode, origin, destination
                )

            # Ensure at least 3 options
            if len(options) < 3 and mode == "flight":
                fallback_airlines = ["IndiGo", "Air India", "Vistara"]
                for airline in fallback_airlines:
                    if len(options) >= 3:
                        break
                    options.append({
                        "name": airline,
                        "departure": "Flexible",
                        "duration": "Approximate",
                        "price": FALLBACK_PRICE["flight"],
                        "comfort": "Economy",
                        "recommended_for": purpose,
                        "reason": "Commonly used airline on this route",
                        "booking_link": build_direct_booking_link(
                            mode, origin, destination
                        )
                    })

            return {
                "mode": mode,
                "options": options
            }

        except Exception:
            # ------------------ HARD FALLBACK FOR ALL MODES ------------------ #

            MODE_FALLBACKS = {
                "flight": [
                    {
                        "name": "IndiGo",
                        "comfort": "Economy",
                        "reason": "Reliable and economical option"
                    },
                    {
                        "name": "Air India",
                        "comfort": "Economy",
                        "reason": "Government-backed full service carrier"
                    },
                    {
                        "name": "Vistara",
                        "comfort": "Premium Economy",
                        "reason": "Better comfort and service"
                    }
                ],
                "train": [
                    {
                        "name": "Rajdhani Express",
                        "comfort": "AC 2 Tier",
                        "reason": "Fast and premium long-distance train"
                    },
                    {
                        "name": "Shatabdi Express",
                        "comfort": "AC Chair Car",
                        "reason": "Day travel with good comfort"
                    },
                    {
                        "name": "Duronto Express",
                        "comfort": "Sleeper / AC 3 Tier",
                        "reason": "Fewer stops and quicker travel"
                    }
                ],
                "bus": [
                    {
                        "name": "RedBus AC Sleeper",
                        "comfort": "AC Sleeper",
                        "reason": "Comfortable overnight travel"
                    },
                    {
                        "name": "Volvo Multi-Axle",
                        "comfort": "AC Semi-Sleeper",
                        "reason": "Smooth highway journey"
                    },
                    {
                        "name": "State Transport Bus",
                        "comfort": "Non-AC Seater",
                        "reason": "Budget-friendly option"
                    }
                ],
                "car": [
                    {
                        "name": "Self Drive (Zoomcar)",
                        "comfort": "Self Drive",
                        "reason": "Flexible and private travel"
                    },
                    {
                        "name": "Ola Outstation",
                        "comfort": "Sedan / SUV",
                        "reason": "Convenient door-to-door travel"
                    },
                    {
                        "name": "Uber Intercity",
                        "comfort": "Sedan / SUV",
                        "reason": "Easy booking and safe travel"
                    }
                ]
            }

            fallback_options = MODE_FALLBACKS.get(mode, [])

            formatted_options = []

            for opt in fallback_options:
                formatted_options.append({
                    "name": opt["name"],
                    "departure": "Flexible",
                    "duration": "Approximate",
                    "price": FALLBACK_PRICE.get(mode, "₹2000–4000"),
                    "comfort": opt["comfort"],
                    "recommended_for": purpose,
                    "reason": opt["reason"],
                    "booking_link": build_direct_booking_link(
                        mode, origin, destination
                    )
                })

            return {
                "mode": mode,
                "options": formatted_options
            }
