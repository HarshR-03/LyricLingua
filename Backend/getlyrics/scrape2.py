import requests
from bs4 import BeautifulSoup
import aiohttp

# query = "j-lyric.com ヨルシカ 晴る"
# url = 'http://api.duckduckgo.com/?q={query}&format=json'

async def scrape_result(url):
    headers = {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/58.0.3029.110 Safari/537.3'}
    # response = requests.get(url, headers=headers)
    async with aiohttp.ClientSession() as session:
        async with session.get(url, headers=headers) as response:
            # print(response.status_code,response.reason)
            if response.status == 200:
                soup = BeautifulSoup(await response.text(), 'html.parser')
               
                resultSnippets = soup.find_all('a', class_='result__a')
                urllist = []
                for x in resultSnippets:
                    if "j-lyric.net" in x['href'] and ".html" in x['href']:
                        urllist.append(x['href'])
                    if "lyrical-nonsense.com" in x['href'] and "lyrics" in x['href']:
                        urllist.append(x['href'])
                    if "uta5.com" in x['href']:
                        urllist.append(x['href'])
                # print(urllist)
                return urllist
    return None
