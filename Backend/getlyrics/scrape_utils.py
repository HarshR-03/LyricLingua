from abc import ABC,abstractmethod
from bs4 import BeautifulSoup
from langchain_mistralai.embeddings import MistralAIEmbeddings
from langchain.chat_models import init_chat_model
from langchain_core.prompts import SystemMessagePromptTemplate, HumanMessagePromptTemplate, ChatPromptTemplate
from dotenv import load_dotenv
import os
import sys
from pathlib import Path

load_dotenv()

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

        self.model = init_chat_model("mistral-saba-2502", model_provider="mistralai")
    
    async def get_query_from_chat(self,data):
        try:
            q = await self.prompt.ainvoke({"input":f"{data}"})
            res = await self.model.ainvoke(q)
            return res.content
        except Exception as e:
            print(f"error occured: {e}")
    