import React, { useState, useEffect } from "react";
import PropTypes from "prop-types";
import { useLocation, useParams } from "react-router-dom";
import VideoPlayer from "./vidplayer";
import ChatbotPopup from "./chatbot";

//
const YoutubeEmbed = () => {
  const [data, setData] = useState("Lyrics Loading");
  const [LyricsLoaded,setLyricsLoaded] = useState(false);
  const { videoId } = useParams()
  const { state } = useLocation()
  const [Ind, setInd] = useState(0)
  function handleNext(){
    if(Ind==data.length-1){
      setInd(0)
    }
    else{
      setInd(Ind+1)
    }
  }
  useEffect(() => {
    const getData = async (state) => {
      setLyricsLoaded(false);
      var lyrics = await fetch('https://lyriclingua.onrender.com/lyrics/',
        {
          method: "POST",
          body: JSON.stringify(state)
        }
      )
      lyrics = await lyrics.json();
      console.log(lyrics)
      setData(lyrics);
      setLyricsLoaded(true);
    }
    state && getData(state);
  }
    , [state])
  function dummy(){
    var lyric = data[0].slice(1,-1)
    var temp = document.createElement('div')
    temp.innerHTML = lyric
    return temp
  }
  return (
    <div className="p-4 min-w-full min-h-full grid grid-cols-1 md:grid-cols-2 gap-4">
      <div className="m-4 sm:m-8 flex flex-col items-center">
        <div className="w-full h-full p-4 rounded-lg">
          <VideoPlayer videoId={videoId} />
        </div>
      </div>
      
  
      <div className="m-4 sm:m-8 flex flex-col items-center">
        <div className="w-full h-full bg-gray-700 bg-opacity-50 p-4 rounded-lg text-white">
          {!LyricsLoaded? <div className="text-lg">{data}</div> :
          <div
            dangerouslySetInnerHTML={{ __html: (data[0][1]=='[')? data[0].slice(1,-1):data[0] }}
            className="whitespace-pre-wrap text-lg leading-relaxed max-h-96 overflow-y-auto"
          />}
        </div>
      </div>

    <ChatbotPopup/>
    </div>
  );
  
};


export default YoutubeEmbed;
