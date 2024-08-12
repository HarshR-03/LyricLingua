import React, { useState, useEffect } from "react";
import PropTypes from "prop-types";
import { useLocation, useParams } from "react-router-dom";
import VideoPlayer from "./vidplayer";

const YoutubeEmbed = () => {
  const [data, setData] = useState("Lyrics Loading");
  const { videoId } = useParams()
  const { state } = useLocation()
  useEffect(() => {
    const getData = async (state) => {
      var lyrics = await fetch('http://localhost:8000/lyrics/',
        {
          method: "POST",
          body: JSON.stringify(state)
        }
      )
      lyrics = await lyrics.json();
      console.log(lyrics)
      setData(lyrics);
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
    <div className=" p-4 min-w-full min-h-full grid grid-cols-1 md:grid-cols-2 gap-4">
      <div className="m-4 sm:m-8 flex flex-col items-center">
        <div className="w-full h-full p-4 rounded-lg">
          <VideoPlayer videoId={videoId} />
        </div>
      </div>
  
      <div className="m-4 sm:m-8 flex flex-col items-center">
        <div className="w-full h-full bg-gray-700 bg-opacity-50 p-4 rounded-lg text-white">
          <div
            dangerouslySetInnerHTML={{ __html: data }}
            className="whitespace-pre-wrap text-lg leading-relaxed"
          />
        </div>
      </div>
    </div>
  );
  
};


export default YoutubeEmbed;