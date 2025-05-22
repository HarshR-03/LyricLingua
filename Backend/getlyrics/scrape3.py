# from llama_index.llms.groq import Groq
# from llama_index.core.llms import ChatMessage
# import requests
from langchain_mistralai.embeddings import MistralAIEmbeddings
from langchain.chat_models import init_chat_model
from langchain_core.prompts import SystemMessagePromptTemplate, HumanMessagePromptTemplate, ChatPromptTemplate
from dotenv import load_dotenv
import os
import sys
from pathlib import Path

load_dotenv()
# BASE_DIR = Path(__file__).resolve().parent.parent

# Add parent directory to the Python path
# sys.path.append(str(BASE_DIR.parent))

# Load the .env file
# load_dotenv(dotenv_path=BASE_DIR / '.env')
# async def get_query_from_chat(data):
#     print(data)
#     llm = Groq(model="mixtral-8x7b-32768", api_key=os.getenv("GROQ_API_KEY"))

#     messages = [
#         ChatMessage(
#             role="system", content='''I will give you a video title and description in romaji.
#                                     You only extract the song title and artist name from them and, if applicable, 
#                                     convert the romaji to japanese kana/kanji and return the answer in the format:
#                                     "j-lyric uta-5 lyricalnonsense <songname in hiragana/katakana/kanji/english> <artistname in hiragana/katakana/kanji/english>."
#                                     If possible stick to hiragana/katakana/kanji if the song title and artist name are in japanese
#                                     Return ONLY IN THE FORMAT SPECIFIED, DON'T return any additional notes or metadata '''
#         ),
#         ChatMessage(role="user", content=f'''{data}'''),
#     ]
#     resp = llm.chat(messages)
#     ind = str(resp).find("assistant")
#     resp=str(resp)[ind+10:]
#     print(resp)
#     return resp

async def get_query_from_chat(data):
    print(data)
    try:
        prompt = ChatPromptTemplate.from_messages([
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
        model = init_chat_model("mistral-saba-2502", model_provider="mistralai")
        q = prompt.invoke({"input":f"{data}"})
        res = model.invoke(q)
    except Exception as e:
        print(f"error occured: {e}")
    return res.content