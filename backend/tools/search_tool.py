# import requests
# import os
# from dotenv import load_dotenv
# from requests.exceptions import RequestException

# load_dotenv()

# SERPER_API = os.getenv("SERPER_API_KEY")
# print("SERPER:", os.getenv("SERPER_API_KEY"))
# print("GROQ:", os.getenv("GROQ_API_KEY"))

# class SearchTool:

#     @staticmethod
#     def search(query: str) -> str:
#         url = "https://google.serper.dev/search"
#         headers = {
#             "X-API-KEY": SERPER_API,
#             "Content-Type": "application/json"
#         }
#         payload = {"q": query}

#         try:
#             response = requests.post(
#                 url,
#                 headers=headers,
#                 json=payload,
#                 timeout=8   # shorter timeout
#             )
#             response.raise_for_status()
#             data = response.json()

#             if "organic" not in data or not data["organic"]:
#                 return "No data found"

#             results = data["organic"][:5]
#             return "\n".join(
#                 f"- {item['title']}: {item.get('snippet', '')[:120]}"
#                 for item in results
#             )

#         except RequestException as e:
#             # 🔴 VERY IMPORTANT: never crash
#             print(f"[SearchTool] Search failed: {e}")
#             return "No data found"










# import requests
# import os

# class SearchTool:
#     @staticmethod
#     def search(query: str):
#         try:
#             url = "https://google.serper.dev/search"

#             headers = {
#                 "X-API-KEY": os.getenv("SERPER_API_KEY"),
#                 "Content-Type": "application/json"
#             }

#             payload = {
#                 "q": query,
#                 "num": 5
#             }

#             response = requests.post(
#                 url,
#                 headers=headers,
#                 json=payload,
#                 timeout=10
#             )

#             response.raise_for_status()

#             data = response.json()

#             # Return snippets for LLM
#             snippets = []
#             for item in data.get("organic", []):
#                 if "snippet" in item:
#                     snippets.append(item["snippet"])

#             return "\n".join(snippets) if snippets else "No data found"

#         except Exception as e:
#             print("[SearchTool] Search failed:", e)
#             return "No data found"







# tools/search_tool.py

class SearchTool:
    @staticmethod
    def search(query: str) -> str:
        print(f"[SearchTool] Stub search used for: {query}")
        return "No data found"
