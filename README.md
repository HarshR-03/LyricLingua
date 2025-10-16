# Lyric Lingua

LyricLingua is a comprehensive platform for streaming licensed anime and Japanese music for the purpose of learning the language. It provides users with legally sourced lyrics and 
learning tools, and integrates with official kanji databases to offer detailed word information. It is a fun way to learn japanese using immersion.
Demo : [Video Link](https://drive.google.com/file/d/1tFJSGlQYTx6KbiUgA8yXogdI8lOZLMg0/view?usp=drive_link)

# Technical Stack:

Frontend: React

Backend: Django, Streamlit (For chatbot)

APIs: Youtube Data API

# Features
 - Stream music videos(using youtube data api)
 - Legal access to song lyrics in Kanji
 - LLM Chatbot that can answer any language related queries.

 Used Youtube data api provided by google for streaming music videos from youtube. Used Langchain with gemini api to
 build a RAG chatbot that can answer complex queries about the japanese language. The chatbot also uses tool calling to look up certain kanji vocabulary.

 TODO:
 - Migrate Backend from render to a cloud provider for better uptime.

   
