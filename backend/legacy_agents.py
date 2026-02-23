from groq import Groq
import os
from dotenv import load_dotenv
from tools.search_tool import SearchTool

load_dotenv()

client = Groq(api_key=os.getenv("GROQ_API_KEY"))

class DestinationAgent:
    def run(self, destination):
        search_data = SearchTool.search(
            f"famous tourist attractions in {destination} India list"
        )

        if search_data == "No data found":
            return "Attraction data not available."

        prompt = f"""
You are given real web search results.
ONLY use this information.
Do NOT use prior knowledge.

Search results:
{search_data}

Task:
List exactly 3 famous attractions in {destination}.
"""

        return client.chat.completions.create(
            model="llama-3.1-8b-instant",
            messages=[{"role": "user", "content": prompt}],
            max_tokens=120
        ).choices[0].message.content


class HotelAgent:
    def run(self, destination):
        search_data = SearchTool.search(
            f"site:booking.com OR site:tripadvisor.com hotels in {destination}"
        )

        if search_data == "No data found":
            return "Hotel data not available."

        prompt = f"""
You are given web search snippets.

RULES:
1. Extract ONLY real hotel names.
2. Ignore price aggregator sites and generic price lists.
3. Each item MUST contain a hotel name.
4. If price is missing, write "Price not available".
5. Do NOT add any explanation text.

Search snippets:
{search_data}

Output format (exact):
- Hotel Name – Price
- Hotel Name – Price
- Hotel Name – Price
"""

        return client.chat.completions.create(
            model="llama-3.1-8b-instant",
            messages=[{"role": "user", "content": prompt}],
            max_tokens=120
        ).choices[0].message.content
