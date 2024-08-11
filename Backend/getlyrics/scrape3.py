from llama_index.llms.groq import Groq
from llama_index.core.llms import ChatMessage
import requests

def get_query_from_chat(data):
    print(data)
    llm = Groq(model="mixtral-8x7b-32768", api_key="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")

    messages = [
        ChatMessage(
            role="system", content='''I will give you a video title and description in romaji.
                                    You only extract the song title and artist name from them and, if applicable, 
                                    convert the romaji to japanese kana/kanji and return the answer in the format:
                                    "j-lyric <songname in hiragana/katakana/kanji/english> <artistname in hiragana/katakana/kanji/english>."
                                    Return only the answer DON'T return any additional notes or metadata '''
        ),
        ChatMessage(role="user", content=f'''{data}'''),
    ]
    resp = llm.chat(messages)
    ind = str(resp).find("assistant")
    resp=str(resp)[ind+10:]
    return resp


