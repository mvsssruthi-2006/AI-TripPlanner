from groq import Groq
import os
from dotenv import load_dotenv
import json
import math
import random

load_dotenv()
client = Groq(api_key=os.getenv("GROQ_API_KEY"))

import random

# ---------- CLEAN TEXT TEMPLATES (NO AREA NAMES) ---------- #

MORNING_TEMPLATES = [
    "Start your day by visiting {name} and taking in its early-morning charm.",
    "Begin the morning with a peaceful exploration of {name}.",
    "Kick off your day at {name}, enjoying the fresh atmosphere and surroundings.",
    "Spend the morning discovering the history and beauty of {name}.",
    "Head out early to explore {name} before the crowds arrive.",
    "Visit {name} in the morning and enjoy a relaxed sightseeing experience.",
    "Wake up early and immerse yourself in the sights of {name}.",
    "Explore {name} during the calm morning hours for the best experience.",
    "Start your sightseeing with a visit to the iconic {name}.",
    "Enjoy a refreshing morning walk and exploration at {name}."
]

AFTERNOON_TEMPLATES = [
    "After lunch, continue your journey with a visit to {name}.",
    "Spend the afternoon exploring {name} at a comfortable pace.",
    "Head to {name} for an engaging afternoon of sightseeing.",
    "Enjoy lunch nearby before discovering the highlights of {name}.",
    "Use the afternoon to explore {name} and its surroundings.",
    "Relax after lunch and take time to appreciate {name}.",
    "Spend a laid-back afternoon discovering the charm of {name}.",
    "Visit {name} in the afternoon and enjoy unhurried exploration.",
    "Explore {name} while enjoying a slower, more relaxed pace.",
    "Continue sightseeing by visiting {name} and nearby attractions."
]

EVENING_ATTR_TEMPLATES = [
    "Wrap up the day with an evening visit to {name}.",
    "Spend the evening exploring {name} under a different atmosphere.",
    "Visit {name} in the evening and enjoy its scenic beauty.",
    "End your sightseeing day with a relaxed visit to {name}.",
    "Enjoy a memorable evening exploring {name}.",
    "Head to {name} as the day winds down for a peaceful experience.",
    "Experience {name} in the evening when it feels more vibrant.",
    "Conclude the day with sightseeing at {name}.",
    "Spend a calm evening visiting {name} and soaking in the ambiance.",
    "Enjoy the final sightseeing stop of the day at {name}."
]


EVENING_LEISURE_TEMPLATES = [
    "Relax in the evening with local food and a gentle walk nearby.",
    "Spend the evening enjoying dinner and soaking in the local atmosphere.",
    "Unwind with a relaxed evening exploring nearby streets and cafés.",
    "Enjoy a peaceful evening with food, leisure, and light exploration.",
    "Have a calm evening relaxing after a full day of sightseeing.",
    "Use the evening to rest, enjoy dinner, and recharge for the next day.",
    "Spend the evening casually exploring markets or dining spots.",
    "Relax and enjoy free time with food and leisure activities.",
    "Enjoy a laid-back evening experiencing the local vibe.",
    "End the day with a comfortable evening of rest and casual exploration."
]

from groq import Groq
import os
from dotenv import load_dotenv
import json
import random

load_dotenv()
client = Groq(api_key=os.getenv("GROQ_API_KEY"))

class ItineraryAgent:
    
    def run(self, context: dict) -> dict:

        user = context["user_profile"]
        custom_prompt = (user.get("custom_prompt") or "").lower()
        destination_data = context["destination"]
        hotels = context.get("hotels", {})

        destination = destination_data["destination"]
        attractions = destination_data.get("top_attractions", [])
        stay_areas = list(hotels.keys())  # ONLY accommodation areas

        days = int(user.get("days", 3))
        pace = user.get("pace", "moderate")

        # ---------- PACE RULES ---------- #
        pace_rules = {
            "relaxed": {"per_day": 2, "evening_attr": False},
            "moderate": {"per_day": 3, "evening_attr": True},
            "fast": {"per_day": 4, "evening_attr": True}
        }
        prefer_relaxed = any(
            k in custom_prompt for k in ["relax", "peaceful", "slow", "less walking"]
        )

        prefer_evening_leisure = any(
            k in custom_prompt for k in ["food", "shopping", "cafes", "relax evening"]
        )

        prefer_evening_attractions = any(
            k in custom_prompt for k in ["sightseeing", "explore more", "busy", "cover more"]
        )

        rules = pace_rules.get(pace, pace_rules["moderate"])
        per_day = rules["per_day"]

        # ---------- STEP 1: DISTRIBUTE ATTRACTIONS ---------- #
        day_plan = {}
        idx = 0

        for d in range(1, days + 1):
            day_plan[f"Day {d}"] = attractions[idx: idx + per_day]
            idx += per_day

        # ---------- STEP 2: TRY LLM ---------- #
        prompt = f"""
You are a senior travel itinerary planner.

USER PERSONAL REQUEST (VERY IMPORTANT):
{user.get("custom_prompt", "No additional request")}

RULES (VERY STRICT):
1. Use ONLY the attractions provided for each day.
2. Do NOT invent new places.
3. Do NOT repeat attractions.
4. Morning / Afternoon / Evening must be natural sentences.
5. Stay Area MUST be one of these: {stay_areas}
6. Evening can be attraction OR leisure.
7. Output ONLY valid JSON.

DAY-WISE ATTRACTIONS:
{json.dumps(day_plan, indent=2)}

OUTPUT FORMAT:
{{
  "Day 1": {{
    "Morning": "...",
    "Afternoon": "...",
    "Evening": "...",
    "Stay Area": "..."
  }}
}}
"""

        itinerary = {}

        try:
            response = client.chat.completions.create(
                model="llama-3.1-8b-instant",
                messages=[{"role": "user", "content": prompt}],
                max_tokens=800
            )
            itinerary = json.loads(response.choices[0].message.content)
        except Exception:
            itinerary = {}

        # ---------- SAFE STAY AREA PICKER ---------- #
        def pick_stay_area(day_index: int) -> str:
            if stay_areas:
                return stay_areas[day_index % len(stay_areas)]
            return destination

        # ---------- SMART FALLBACK (ONLY IF LLM FAILS OR IS PARTIAL) ---------- #
        for d in range(1, days + 1):
            day = f"Day {d}"

            # ---------- CASE 1: LLM OUTPUT EXISTS → ONLY FIX STAY AREA ---------- #
            if day in itinerary and isinstance(itinerary[day], dict):
                sa = itinerary[day].get("Stay Area")

                if not isinstance(sa, str) or sa not in stay_areas:
                    primary_attr = day_plan.get(day, [{}])[0]
                    attr_area = primary_attr.get("area") if isinstance(primary_attr, dict) else None

                    itinerary[day]["Stay Area"] = (
                        attr_area if attr_area in stay_areas
                        else pick_stay_area(d - 1)
                    )
                continue

            # ---------- CASE 2: FULL FALLBACK ---------- #
            todays_attractions = day_plan.get(day, [])
            itinerary[day] = {}

            # ---------- MORNING (ALWAYS ATTRACTION IF AVAILABLE) ---------- #
            if todays_attractions:
                a = todays_attractions[0]
                itinerary[day]["Morning"] = random.choice(MORNING_TEMPLATES).format(
                    name=a["name"]
                )
            else:
                itinerary[day]["Morning"] = random.choice([
                    "Begin the day with a relaxed breakfast and light exploration.",
                    "Start your morning at an easy pace, enjoying the local vibe.",
                    "Enjoy a calm morning before heading out for the day."
                ])

            # ---------- AFTERNOON ---------- #
            if len(todays_attractions) > 1:
                a = todays_attractions[1]
                itinerary[day]["Afternoon"] = random.choice(AFTERNOON_TEMPLATES).format(
                    name=a["name"]
                )
            elif todays_attractions:
                itinerary[day]["Afternoon"] = random.choice([
                    "Take a break for lunch and continue exploring nearby sights.",
                    "Relax after lunch and explore attractions at a comfortable pace.",
                    "Enjoy lunch followed by light sightseeing."
                ])
            else:
                itinerary[day]["Afternoon"] = random.choice([
                    "Spend the afternoon browsing local markets or cafés.",
                    "Use the afternoon for leisure, shopping, or casual exploration.",
                    "Enjoy a slow afternoon discovering the surroundings."
                ])

            # ---------- EVENING (SMART DECISION) ---------- #
            if len(todays_attractions) > 2:
                a = todays_attractions[2]
                itinerary[day]["Evening"] = random.choice(EVENING_ATTR_TEMPLATES).format(
                    name=a["name"]
                )

            elif len(todays_attractions) >= 2 and (
                prefer_evening_attractions or (not prefer_evening_leisure and random.random() > 0.4)
            ):
                a = todays_attractions[-1]
                itinerary[day]["Evening"] = random.choice(EVENING_ATTR_TEMPLATES).format(
                    name=a["name"]
                )

            else:
                itinerary[day]["Evening"] = random.choice(EVENING_LEISURE_TEMPLATES)

            # ---------- STAY AREA (STRICT: ONLY FROM ACCOMMODATION AGENT) ---------- #
            primary_area = (
                todays_attractions[0].get("area")
                if todays_attractions and isinstance(todays_attractions[0], dict)
                else None
            )

            itinerary[day]["Stay Area"] = (
                primary_area if primary_area in stay_areas
                else pick_stay_area(d - 1)
            )

        return itinerary