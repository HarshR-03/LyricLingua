import React, { useState, useEffect } from "react";
import PropTypes from "prop-types";
import { useLocation, useParams } from "react-router-dom";
import VideoPlayer from "./vidplayer";

const YoutubeEmbed = () => {
  const [data, setData] = useState();
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
  return (<div className="m-4 p-2 min-w-full min-h-full grid-cols-2"> 
  <div className="m-4 sm:m-8">
    <VideoPlayer videoId={videoId} />
  </div>
  {data && <div>
    {dummy()}
  </div>}
  </div>)
};


export default YoutubeEmbed;