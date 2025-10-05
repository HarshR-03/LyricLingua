from .scrape_utils import *
import aiohttp
import asyncio
import traceback
import random


class Scraper:
    def __init__(self):
        self.user_agents = [
        "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36",
        "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/14.1.1 Safari/605.1.15",
        "Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.101 Safari/537.36",
        ]
        self.header = {
            'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/58.0.3029.110 Safari/537.3'
        }
        self.linkforUrlExtraction = 'https://duckduckgo.com/html/?q='

    async def get_lyrics(self, results):
        "Given a list of urls(results), fetch the lyrics from the urls"
        lyrics = []
        headers = self.header 
        scrapers = {
            url: (JLyricScraper(url) if "j-lyric" in url else
                LyricalNonsenseScraper(url) if "lyrical-nonsense.com" in url else
                Uta5Scraper(url) if "uta5.com" in url else None)
            for url in results
        }

        async with aiohttp.ClientSession() as session:
            # Create tasks for each URL with its scraper
            tasks = [scrapers[url].scrape_lyrics(session, headers) for url in results if scrapers[url]]
            results_list = await asyncio.gather(*tasks, return_exceptions=True)
            for result in results_list:
                if isinstance(result, Exception):
                    print(f"Error: {result}")
                else:
                    lyrics.extend(result)
        return lyrics

    async def scrape_urls(self,query):
        "given a generated query, search the web and scrape suitable links for lyrics extraction"
        url = self.linkforUrlExtraction + query
        randomUsrAgent = random.choice(self.user_agents)
        self.header['User-Agent'] = randomUsrAgent

        async with aiohttp.ClientSession() as session:
            async with session.get(url, headers=self.header) as response:
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
                    print("urllist: ",urllist)
                    return urllist
                else:
                    print("response: ",response)
        return None
    
    async def run(self,data):
        try:
            await asyncio.sleep(2)
            query = await LLMQueryParser().get_query_from_chat(data)

            await asyncio.sleep(10)
            urlsToScrape = await self.scrape_urls(query)

            lyrics = await self.get_lyrics(urlsToScrape)
            return lyrics
        except Exception as e:
            print(e)
            print(traceback.format_exc())


    

    
    