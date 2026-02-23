from groq import Groq
import os
from dotenv import load_dotenv
from tools.search_tool import SearchTool
import json
from collections import Counter
import urllib.parse
import re

load_dotenv()
client = Groq(api_key=os.getenv("GROQ_API_KEY"))

class AccommodationAgent:
    def run(self, context: dict) -> dict:
        destination_data = context["destination"]
        user = context["user_profile"]

        destination = destination_data["destination"]
        attractions = destination_data.get("top_attractions", [])

        hotel_category = user.get("hotel_category", "3-star")
        accommodation_type = user.get("accommodation_type", "hotel")
        budget = user.get("budget", 0)
        days = max(int(user.get("days", 1)), 1)
        travelers = max(int(user.get("travelers", 1)), 1)
        purpose = user.get("purpose", "vacation")

        # ---------------- PRICE LOGIC ---------------- #
        base_price = {
            "budget": 2000,
            "3-star": 3500,
            "4-star": 6000,
            "5-star": 10000
        }.get(hotel_category, 3500)

        max_affordable = budget / (days * travelers) if (days * travelers) > 0 else 0
        nightly_price = (
            min(base_price, int(max_affordable * 0.9))
            if max_affordable > 0 else base_price
        )

        price_range = f"₹{nightly_price}–{nightly_price + 2000}"

        # ---------------- PICK TOP 3 AREAS ---------------- #
        area_counter = Counter(
            a["area"] for a in attractions
            if isinstance(a, dict) and a.get("area")
        )

        top_areas = [area for area, _ in area_counter.most_common(3)]
        
        # If no areas found, use destination as fallback
        if not top_areas:
            top_areas = [destination]
            
        hotels_by_area = {}

        for area in top_areas:
            search_query = (
                f"{hotel_category} {accommodation_type} hotels near "
                f"{area} {destination} India"
            )

            search_data = SearchTool.search(search_query)
            
            # Even if search_data is "No data found", we still try LLM
            prompt = f"""
You are a hotel recommendation expert.

DESTINATION: {destination}
AREA: {area}

RULES:
1. Hotels must be CLOSE to {area}.
2. Suggest MAXIMUM 4 hotels.
3. Price must be INR only.
4. NEVER say "price not available".
5. Use price range if unsure: {price_range}.
6. Output ONLY valid JSON.
7. No explanations.

OUTPUT FORMAT:
[
  {{
    "name": "Hotel Name",
    "price_per_night": "{price_range}",
    "suitable_for": "{purpose}"
  }}
]
"""

            try:
                response = client.chat.completions.create(
                    model="llama-3.1-8b-instant",
                    messages=[{"role": "user", "content": prompt}],
                    max_tokens=350
                )
                
                content = response.choices[0].message.content
                print(f"LLM Response for {area}: {content[:100]}...")  # Debug
                
                # Try to extract JSON if LLM added extra text
                json_match = re.search(r'\[[\s\S]*\]', content)
                if json_match:
                    content = json_match.group()
                
                hotels = json.loads(content)
                hotels = hotels[:4] if isinstance(hotels, list) else []

                enriched = []
                for hotel in hotels:
                    name = hotel.get("name")
                    if not name:
                        continue

                    query = urllib.parse.quote(
                        f"{name} {area} {destination}"
                    )
                    booking_link = (
                        f"https://www.google.com/maps/search/?api=1&query={query}"
                    )

                    enriched.append({
                        "name": name,
                        "price_per_night": hotel.get("price_per_night", price_range),
                        "suitable_for": hotel.get("suitable_for", purpose),
                        "booking_link": booking_link
                    })

                if enriched:
                    hotels_by_area[area] = enriched
                    print(f"✅ Added {len(enriched)} hotels for {area}")

            except Exception as e:
                print(f"⚠️ Error for {area}: {str(e)} - using fallback")
                # FALLBACK: Create 2-3 hotels manually
                hotels_by_area[area] = [
                    {
                        "name": f"{hotel_category.title()} {accommodation_type.title()} near {area}",
                        "price_per_night": price_range,
                        "suitable_for": purpose,
                        "booking_link": f"https://www.google.com/maps/search/?api=1&query={urllib.parse.quote(f'{area} {destination} hotel')}"
                    },
                    {
                        "name": f"{area} Grand {accommodation_type.title()}",
                        "price_per_night": price_range,
                        "suitable_for": purpose,
                        "booking_link": f"https://www.google.com/maps/search/?api=1&query={urllib.parse.quote(f'{area} grand hotel')}"
                    }
                ]

        # FINAL SAFETY NET - If still no hotels, create for destination
        if not hotels_by_area:
            hotels_by_area[destination] = [
                {
                    "name": f"Standard {hotel_category} Hotel in {destination}",
                    "price_per_night": price_range,
                    "suitable_for": purpose,
                    "booking_link": f"https://www.google.com/maps/search/?api=1&query={urllib.parse.quote(f'{destination} hotel')}"
                }
            ]

        print(f"🏨 Returning hotels for areas: {list(hotels_by_area.keys())}")
        return hotels_by_area