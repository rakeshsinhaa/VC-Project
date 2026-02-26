import asyncio
from ai_extractor import extract_company_data

async def run_test():
    url = "https://example.com"
    text = "Example company text. We do enterprise software."
    result = await extract_company_data(url, text)
    print("Result:", result)

if __name__ == "__main__":
    asyncio.run(run_test())
