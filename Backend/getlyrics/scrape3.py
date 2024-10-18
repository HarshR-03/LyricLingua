from llama_index.llms.groq import Groq
from llama_index.core.llms import ChatMessage
import requests
from dotenv import load_dotenv
import os
import sys
from pathlib import Path

BASE_DIR = Path(__file__).resolve().parent.parent

# Add parent directory to the Python path
sys.path.append(str(BASE_DIR.parent))

# Load the .env file
load_dotenv(dotenv_path=BASE_DIR / '.env')
async def get_query_from_chat(data):
    print(data)
    llm = Groq(model="mixtral-8x7b-32768", api_key=os.getenv("GROQ_API_KEY"))

    messages = [
        ChatMessage(
            role="system", content='''I will give you a video title and description in romaji.
                                    You only extract the song title and artist name from them and, if applicable, 
                                    convert the romaji to japanese kana/kanji and return the answer in the format:
                                    "j-lyric uta-5 lyricalnonsense <songname in hiragana/katakana/kanji/english> <artistname in hiragana/katakana/kanji/english>."
                                    If possible stick to hiragana/katakana/kanji if the song title and artist name are in japanese
                                    Return ONLY IN THE FORMAT SPECIFIED, DON'T return any additional notes or metadata '''
        ),
        ChatMessage(role="user", content=f'''{data}'''),
    ]
    resp = llm.chat(messages)
    ind = str(resp).find("assistant")
    resp=str(resp)[ind+10:]
    print(resp)
    return resp


