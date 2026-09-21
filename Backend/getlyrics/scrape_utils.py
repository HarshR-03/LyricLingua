from abc import ABC,abstractmethod
from bs4 import BeautifulSoup
from langchain_openai import ChatOpenAI
from langchain_core.prompts import SystemMessagePromptTemplate, HumanMessagePromptTemplate, ChatPromptTemplate
from dotenv import load_dotenv
import os

load_dotenv()


class LLMGatewayError(Exception):
    def __init__(self, message, status_code=502):
        super().__init__(message)
        self.status_code = status_code

class LyricsScrapeInterface(ABC):
    def __init__(self, url:str):
        self.url = url

    @abstractmethod
    def scrape_lyrics(self,session,header):
        pass

class JLyricScraper(LyricsScrapeInterface):
    def __init__(self, url):
        super().__init__(url)

    async def scrape_lyrics(self,session,header):
        if not self.url:
            raise ValueError("url not set!")
        
        async with session.get(self.url, headers=header) as response:
            if response.status == 200:
                    soup = BeautifulSoup(await response.text(), 'html.parser')
                    lyrics_paragraphs = soup.find_all('p', id='Lyric')
                    return [str(lyrics_paragraphs)]
            return []

class LyricalNonsenseScraper(LyricsScrapeInterface):
    def __init__(self, url):
        super().__init__(url)
    
    async def scrape_lyrics(self,session,header):
        if not self.url:
            raise ValueError("url not set!")

        async with session.get(self.url, headers=header) as response:
            if response.status == 200:
                soup = BeautifulSoup(await response.text(), 'html.parser')
                original_div = soup.find('div', id='Original')

                lyrics = []
                if(original_div!=None):
                        pri_lyr_div = original_div.find('div',  class_='olyrictext')
                        div_text = pri_lyr_div.get_text()
                        # to preserve the HTML structure, I use str() to keep the inner HTML
                        div_inner_html = str(pri_lyr_div)
                        lyrics.append(div_inner_html)

                translation_div = soup.find('div', id='English')
                if(translation_div!=None):
                        pri_lyr_div = translation_div.find('div', class_='olyrictext')
                        div_text = pri_lyr_div.get_text()
                        # to preserve the HTML structure, I use str() to keep the inner HTML
                        div_inner_html = str(pri_lyr_div)
                        lyrics.append(div_inner_html)
                if len(lyrics)>0:
                    return lyrics
            return []
        
class Uta5Scraper(LyricsScrapeInterface):
    def __init__(self, url):
        super().__init__(url)

    async def scrape_lyrics(self, session, header):
        if not self.url:
            raise ValueError("url not set!")

        async with session.get(self.url, headers=header) as response:
            if response.status == 200:
                soup = BeautifulSoup(await response.text(), 'html.parser')
                lyrics_paragraphs = soup.find_all('div', class_='tab_content_description')
                lyrics_paragraphs = [lyrics_paragraphs[0]]
                return [str(lyrics_paragraphs)]
            return []
        
class LLMQueryParser:
    def __init__(self):
        self.prompt = ChatPromptTemplate.from_messages([
            SystemMessagePromptTemplate.from_template("""
            You are a strict parser.

            You will receive the title and description of a video in romaji (Latin characters). Your task is to extract only the **song title** and **artist name**, and return the result in the following format:

            j-lyric uta-5 lyricalnonsense <songname> <artistname>

            - Convert the romaji to Japanese (hiragana, katakana, or kanji) when applicable.
            - If the song or artist name is originally in English, leave it in English.
            - Do NOT include any other text, comments, or metadata. Return the result in a single line.
            - Do NOT wrap the result in quotes, code blocks, or markdown.
            - Your output should start directly with "j-lyric uta-5 lyricalnonsense".
        """),
            HumanMessagePromptTemplate.from_template("{input}")
        ])

        account_id = os.getenv("CLOUDFLARE_ACCOUNT_ID")
        gateway_id = os.getenv("CLOUDFLARE_AI_GATEWAY_ID")
        gateway_url = os.getenv("CLOUDFLARE_AI_GATEWAY_URL")
        gateway_token = os.getenv("CLOUDFLARE_AI_GATEWAY_TOKEN")
        if not account_id or not gateway_id or not gateway_url or not gateway_token:
            raise LLMGatewayError(
                "Cloudflare AI Gateway configuration is incomplete", status_code=503
            )

        gateway_url = gateway_url.rstrip("/")
        self.models = {
            "groq": ChatOpenAI(
                model=os.getenv("GROQ_MODEL", "openai/gpt-oss-120b"),
                base_url=f"{gateway_url}/groq",
                api_key=gateway_token,
                default_headers={
                    "cf-aig-authorization": f"Bearer {gateway_token}",
                    "cf-aig-byok-alias": "groq",
                },
            ),
            "mistralai": ChatOpenAI(
                model=os.getenv("MISTRAL_MODEL", "ministral-3b-2512"),
                base_url=f"{gateway_url}/mistral",
                api_key=gateway_token,
                default_headers={
                    "cf-aig-authorization": f"Bearer {gateway_token}",
                    "cf-aig-byok-alias": "mistralai",
                },
            ),
        }
    
    async def get_query_from_chat(self,data):
        q = await self.prompt.ainvoke({"input": f"{data}"})
        errors = []
        for provider in ("groq", "mistralai"):
            try:
                res = await self.models[provider].ainvoke(q)
                return res.content
            except Exception as error:
                errors.append((provider, error))

        final_error = errors[-1][1]
        status_codes = []
        for _, provider_error in errors:
            provider_status = getattr(provider_error, "status_code", None)
            provider_response = getattr(provider_error, "response", None)
            if provider_status is None and provider_response is not None:
                provider_status = getattr(provider_response, "status_code", None)
            if provider_status is not None:
                status_codes.append(provider_status)
        status_code = 429 if 429 in status_codes else (status_codes[-1] if status_codes else None)
        if status_code is None:
            status_code = 429 if any(
                "rate limit" in str(provider_error).lower()
                for _, provider_error in errors
            ) else 502
        raise LLMGatewayError(
            f"AI Gateway request failed: {final_error}", status_code=status_code
        ) from final_error
    