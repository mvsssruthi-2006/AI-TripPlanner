from groq import Groq
import os
from dotenv import load_dotenv
from tools.search_tool import SearchTool
import json
import requests
import urllib.parse

load_dotenv()
client = Groq(api_key=os.getenv("GROQ_API_KEY"))


class DestinationAgent:
    def run(self, context: dict) -> dict:
        """
        FIXED Destination Agent (WITH IMAGES):
        - Validates must-visit places
        - Scales attractions with trip length
        - Maps attractions to areas & types
        - Enriches attractions with images (safe)
        - Outputs structured data for downstream agents
        """

        # Backward compatibility
        user_profile = context.get("user_profile", context)

        destination = user_profile.get("destination")
        if not destination:
            raise ValueError("Destination is required")

        interests = user_profile.get("interests", [])
        purpose = user_profile.get("purpose", "")
        climate = user_profile.get("climate", "")
        must_visit = user_profile.get("must_visit", [])
        days = int(user_profile.get("days", 3))

        # Decide attraction count based on days
        if days <= 2:
            attraction_count = 5
        elif days <= 4:
            attraction_count = 8
        elif days <= 6:
            attraction_count = 10
        elif days <= 8:
            attraction_count = 12
        elif days <= 10:
            attraction_count = 14
        else:
            attraction_count = 16

        search_query = f"top tourist attractions and areas to stay in {destination} India"
        search_data = SearchTool.search(search_query)

        prompt = f"""
You are a senior destination planning expert.

DESTINATION: {destination}
DAYS: {days}
INTERESTS: {interests}
PURPOSE: {purpose}
CLIMATE: {climate}

USER MUST-VISIT PLACES:
{must_visit}

WEB SEARCH DATA:
{search_data}

USER SPECIAL REQUEST:
{user_profile.get("custom_prompt", "None")}

RULES (VERY STRICT):
1. ONLY include places that actually exist in {destination}.
2. Validate must-visit places 100%; exclude invalid ones.
3. Select EXACTLY {attraction_count} attractions.
4. Each attraction MUST include:
   - name
   - area/locality
   - type (culture, nature, food, adventure, shopping, leisure)
5. Attractions must match interests and purpose.
6. Select EXACTLY 2 stay areas based on attraction clusters.
7. Avoid nightlife-heavy places for family/business trips.
8. Output ONLY valid JSON.
9. No explanations.

OUTPUT FORMAT:
{{
  "destination": "{destination}",
  "top_attractions": [
    {{
      "name": "Charminar",
      "area": "Old City",
      "type": "culture"
    }}
  ],
  "key_areas": ["Area 1", "Area 2"]
}}
"""

        response = client.chat.completions.create(
            model="llama-3.1-8b-instant",
            messages=[{"role": "user", "content": prompt}],
            max_tokens=450,
            temperature=0.1
        )

        try:
            data = json.loads(response.choices[0].message.content)
        except Exception:
            data = {
                "destination": destination,
                "top_attractions": [],
                "key_areas": []
            }

        # ---------- SAFETY & SANITY ---------- #

        seen = set()
        cleaned_attractions = []
        for a in data.get("top_attractions", []):
            name = a.get("name")
            if name and name not in seen:
                seen.add(name)
                cleaned_attractions.append(a)

        cleaned_attractions = cleaned_attractions[:attraction_count]

        # ---------- IMAGE ENRICHMENT (SAFE) ---------- #
        
            
        for attraction in cleaned_attractions:
             media = self.get_media_and_description(attraction["name"], destination)
             attraction["image_url"] = media["image_url"]
             attraction["description"] = media["description"]   
        

        key_areas = data.get("key_areas") or ["City Center", "Tourist Area"]

        return {
            "destination": destination,
            "top_attractions": cleaned_attractions,
            "key_areas": key_areas
        }

    # ---------- IMAGE + DESCRIPTION FETCHER (SAFE) ---------- #
    def get_media_and_description(self, place_name: str, destination: str) -> dict:
        import requests, urllib.parse, os

        headers = {"User-Agent": "Mozilla/5.0"}
        UNSPLASH_KEY = os.getenv("UNSPLASH_ACCESS_KEY")

        image_url = ""
        description = ""

        try:
            # ================= 1️⃣ WIKIPEDIA DIRECT ================= #
            wiki_title = urllib.parse.quote(place_name.replace(" ", "_"))
            wiki_url = f"https://en.wikipedia.org/api/rest_v1/page/summary/{wiki_title}"

            res = requests.get(wiki_url, headers=headers, timeout=5)

            if res.status_code == 200:
                data = res.json()

                # Avoid disambiguation pages
                if data.get("type") != "disambiguation":
                    description = data.get("extract", "")

                    if "originalimage" in data:
                        image_url = data["originalimage"]["source"]
                    elif "thumbnail" in data:
                        image_url = data["thumbnail"]["source"]

            # ================= 2️⃣ UNSPLASH ================= #
            if not image_url and UNSPLASH_KEY:
                unsplash_url = "https://api.unsplash.com/search/photos"
                params = {
                    "query": f"{place_name} {destination} landmark",
                    "per_page": 1,
                    "orientation": "landscape",
                    "client_id": UNSPLASH_KEY
                }

                res = requests.get(unsplash_url, params=params, timeout=5).json()
                results = res.get("results", [])

                if results:
                    image_url = results[0]["urls"]["regular"]

            # ================= 3️⃣ FINAL FALLBACK ================= #
            if not image_url:
                image_url = f"https://picsum.photos/800/600?random={urllib.parse.quote(place_name)}"

            return {
                "image_url": image_url,
                "description": description
            }

        except Exception as e:
            print("ERROR:", e)
            return {
                "image_url": f"https://picsum.photos/800/600?random={urllib.parse.quote(place_name)}",
                "description": ""
            }