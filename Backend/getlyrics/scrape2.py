import requests
from bs4 import BeautifulSoup

# query = "j-lyric.com ヨルシカ 晴る"
# url = 'http://api.duckduckgo.com/?q={query}&format=json'

def scrape_result(url):
    headers = {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/58.0.3029.110 Safari/537.3'}
    response = requests.get(url, headers=headers)
    if response.status_code == 200:
        soup = BeautifulSoup(response.content, 'html.parser')
        with open("./prettify.txt",'w',encoding="utf-8") as f:
            f.write(soup.prettify())
        # print(response.content)
        # print(soup)
        # Assuming the lyrics are within a <p> tag with class "text"
        resultSnippets = soup.find_all('a', class_='result__a')
        urllist = []
        for x in resultSnippets:
            if "j-lyric.net" in x['href'] and ".html" in x['href']:
                urllist.append(x['href'])
            # if "lyrical-nonsense.com" in x['href'] and "lyrics" in x['href']:
            #     urllist.append(x['href'])
            if "uta5.com" in x['href']:
                urllist.append(x['href'])
        
        return urllist
    return None

