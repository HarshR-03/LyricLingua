import requests
from bs4 import BeautifulSoup
from .scrape2 import scrape_result
from .scrape3 import get_query_from_chat
import time
# Function to scrape lyrics from J-Lyric.net
def scrape_jlyric(data):
    query = get_query_from_chat(data)
    url = f'https://duckduckgo.com/html/?q={query}'
    time.sleep(200)
    results = scrape_result(url)
    if(not results):
        print('Lyrics not found or unable to scrape.')
    
    # Example song URL
    print(results)

    lyrics = []
    for url in results:
        headers = {
            'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/58.0.3029.110 Safari/537.3'}
        response = requests.get(url, headers=headers)
        if response.status_code == 200:
            soup = BeautifulSoup(response.content, 'html.parser')
            # print(soup)
            # Assuming the lyrics are within a <p> tag with class "text"
            if "j-lyric" in url:
                lyrics_paragraphs = soup.find_all('p', id='Lyric')
            # if "lyrical-nonsense.com" in url:
            #     lyrics_paragraphs = soup.find_all('div', id='PriLyr')
            if "uta5.com" in url:
                lyrics_paragraphs = soup.find_all('div', class_='tab_content_description')
                lyrics_paragraphs = [lyrics_paragraphs[0]]
            lyrics.append(str(lyrics_paragraphs))
    # print(lyrics)
    return lyrics


