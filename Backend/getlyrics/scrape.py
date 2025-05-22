import requests
from bs4 import BeautifulSoup
from .scrape2 import scrape_result
from .scrape3 import get_query_from_chat
import asyncio
import aiohttp
# Function to scrape lyrics from J-Lyric.net
async def scrape_jlyric(data):
    await asyncio.sleep(2)
    try:
        query = await get_query_from_chat(data)
        # print(f"query: {query}")
        header = {
                'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/58.0.3029.110 Safari/537.3'}
        url = f'https://duckduckgo.com/html/?q={query}'
        await asyncio.sleep(10)
        results = await scrape_result(url)
        # Example song URL
        # print(results)
    except Exception as e:
        print(f"error: {e}")    

    lyrics = []
    async with aiohttp.ClientSession() as session:
            for url in results:
                    async with session.get(url, headers=header) as response:
                            if response.status == 200:
                                    soup = BeautifulSoup(await response.text(), 'html.parser')
                                    if "j-lyric" in url:
                                            lyrics_paragraphs = soup.find_all('p', id='Lyric')
                                    if "lyrical-nonsense.com" in url:
                                            # Find the outer div with id='Original'
                                            original_div = soup.find('div', id='Original')
                                            if(original_div!=None):
                                                    pri_lyr_div = original_div.find('div',  class_='olyrictext')
                                                    div_text = pri_lyr_div.get_text()
                                                    # If you want to preserve the HTML structure, use str() to keep the inner HTML
                                                    div_inner_html = str(pri_lyr_div)
                                                    lyrics.append(div_inner_html)

                                            translation_div = soup.find('div', id='English')
                                            if(translation_div!=None):
                                                    pri_lyr_div = translation_div.find('div', class_='olyrictext')
                                                    div_text = pri_lyr_div.get_text()
                                                    # If you want to preserve the HTML structure, use str() to keep the inner HTML
                                                    div_inner_html = str(pri_lyr_div)
                                                    lyrics.append(div_inner_html)
                                    if "uta5.com" in url:
                                            lyrics_paragraphs = soup.find_all('div', class_='tab_content_description')
                                            lyrics_paragraphs = [lyrics_paragraphs[0]]
                                    if("lyrical-nonsense.com" not in url):
                                            lyrics.append(str(lyrics_paragraphs))
    # print(lyrics)
    return lyrics


