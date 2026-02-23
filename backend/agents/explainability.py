from groq import Groq
import os
from dotenv import load_dotenv

load_dotenv()
client = Groq(api_key=os.getenv("GROQ_API_KEY"))

class ExplainabilityAgent:
    def run(self, context: dict) -> str:
        user = context["user_profile"]
        destination = context["destination"]["destination"]

        attractions = context["destination"].get("top_attractions", [])
        attraction_names = [a["name"] for a in attractions[:4]]  # Show more attractions

        hotel_areas = list(context.get("hotels", {}).keys())
        transport_modes = list(context.get("transport", {}).keys())

        pace = user.get("pace", "moderate")
        budget = user.get("budget")
        purpose = user.get("purpose", "vacation")
        interests = user.get("interests", [])
        days = user.get("days", 3)
        travelers = user.get("travelers", 1)
        
        # Get custom prompt and must-visit places
        custom_prompt = user.get("custom_prompt", "")
        must_visit = user.get("must_visit", [])

        # Build the explanation prompt with all context
        prompt = f"""
You are explaining a personalized trip plan to a traveler in a warm, conversational way.

TRIP DETAILS:
- Destination: {destination}
- Duration: {days} days
- Travelers: {travelers}
- Travel Pace: {pace}
- Budget: ₹{budget}
- Purpose: {purpose}
- Main Interests: {", ".join(interests) if interests else "general sightseeing"}

SELECTED ATTRACTIONS:
{", ".join(attraction_names)}

ACCOMMODATION AREAS:
{", ".join(hotel_areas[:2]) if hotel_areas else "various areas"}

TRANSPORT MODE:
{transport_modes[0] if transport_modes else "public transport"}

USER'S MUST-VISIT PLACES:
{", ".join(must_visit) if must_visit else "None specified"}

USER'S SPECIAL REQUESTS (VERY IMPORTANT):
"{custom_prompt if custom_prompt else "None"}"

TASK:
Write a friendly, personalized explanation (7-9 sentences) that covers:

1. Start by acknowledging their trip to {destination}
2. Address their interests ({", ".join(interests)}) - if their interest doesn't match the destination (e.g., "beach" in a landlocked city), acknowledge this warmly and explain alternatives
3. Specifically explain how you incorporated their special request: "{custom_prompt}" - be EXPLICIT about how you avoided crowded places, selected peaceful spots, and chose scenic locations
4. Mention how their must-visit places ({", ".join(must_visit) if must_visit else "none"}) were prioritized
5. Explain why the selected attractions ({", ".join(attraction_names[:3])}) match their {pace} pace and {purpose} purpose
6. Briefly mention why the accommodation areas were chosen
7. Explain the transport choice
8. Wrap up by emphasizing how the budget (₹{budget}) is well-utilized

IMPORTANT RULES:
- Use "you" and "your" to make it personal
- NO bullet points or numbered lists in the output
- Write naturally as if talking to a friend
- Be specific about how the custom request was addressed
- If there's a mismatch (like beach interest in a landlocked city), address it warmly
- Keep it conversational but informative
"""

        try:
            response = client.chat.completions.create(
                model="llama-3.1-8b-instant",
                messages=[{"role": "user", "content": prompt}],
                max_tokens=500,
                temperature=0.7
            )

            text = response.choices[0].message.content.strip()

            # Safety check
            if len(text.split(".")) < 5:
                raise ValueError("Incomplete explanation")

            return text

        except Exception as e:
            # 🔒 ENHANCED FALLBACK
            fallback_parts = []
            
            # Opening
            fallback_parts.append(
                f"I've carefully planned your {days}-day trip to {destination} with your preferences in mind."
            )
            
            # Address interests
            if "beach" in [i.lower() for i in interests] and destination.lower() in ["hyderabad", "delhi", "bangalore", "pune"]:
                fallback_parts.append(
                    f"While {destination} doesn't have beaches, I've included water-based attractions and parks with serene lakes to give you peaceful waterfront experiences."
                )
            elif interests:
                fallback_parts.append(
                    f"The selected attractions like {', '.join(attraction_names[:3])} perfectly match your interests in {', '.join(interests)}."
                )
            
            # Custom prompt - be specific
            if custom_prompt:
                if "peaceful" in custom_prompt.lower() or "not crowded" in custom_prompt.lower():
                    fallback_parts.append(
                        f"Following your request for '{custom_prompt}', I've specifically selected quieter attractions and scheduled visits during less crowded times to ensure a peaceful experience."
                    )
                elif "scenery" in custom_prompt.lower() or "scenic" in custom_prompt.lower():
                    fallback_parts.append(
                        f"To honor your request for '{custom_prompt}', I've prioritized locations known for beautiful views and photogenic spots."
                    )
                else:
                    fallback_parts.append(
                        f"Your special request '{custom_prompt}' has been carefully incorporated throughout the itinerary."
                    )
            
            # Must-visit
            if must_visit:
                fallback_parts.append(
                    f"Your must-visit destination, {must_visit[0]}, is prioritized on Day 1 to ensure you experience it when you're most energized."
                )
            
            # Pace and accommodation
            fallback_parts.append(
                f"The {pace} pace means you'll have plenty of time to soak in each location without rushing, and the accommodation in {hotel_areas[0] if hotel_areas else 'central areas'} keeps you close to major attractions."
            )
            
            # Transport and budget
            fallback_parts.append(
                f"The {transport_modes[0] if transport_modes else 'selected transport'} option balances comfort and affordability, helping you stay within your ₹{budget} budget while enjoying a smooth {purpose} experience."
            )
            
            return " ".join(fallback_parts)