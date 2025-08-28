import React, { useEffect, useState, useRef } from "react";
import YouTube from "react-youtube";
import { Play, Pause, Volume2, VolumeX } from "lucide-react";
import LyricsGallery from "./LyricComp";
import { useLocation, useParams } from "react-router-dom";


const Vidpage = () => {
  const [chatOpen, setChatOpen] = useState(false);
//   const [videoId, setVideoId] = useState("dQw4w9WgXcQ");

  // Player states
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [volume, setVolume] = useState(100);
  const [isMuted, setIsMuted] = useState(false);


  const [data, setData] = useState("Lyrics Loading");
  const [LyricsLoaded,setLyricsLoaded] = useState(false);
  const { videoId } = useParams()
  const { state } = useLocation()

  useEffect(() => {
    const getData = async (state) => {
      setLyricsLoaded(false);
      var lyrics = await fetch('https://lyriclingua.onrender.com/lyrics/',
        {
          method: "POST",
          body: JSON.stringify(state)
        }
      )
      if(lyrics.ok){
        lyrics = await lyrics.json();
      }
      else{
        lyrics = ["Error. Unable to scrape Lyrics"]
      }
      console.log(lyrics)
      setData(lyrics);
      setLyricsLoaded(true);
    }
    state && getData(state);
  }
    , [state])
  // Reference to store the YouTube player instance
  const playerRef = useRef(null);

  const toggleChat = () => {
    setChatOpen(!chatOpen);
  };

  // YouTube player options
  const opts = {
    height: "100%",
    width: "100%",
    playerVars: {
      autoplay: 0,
      modestbranding: 1,
      controls: 0,
    },
  };

  // Format time in MM:SS
  const formatTime = (seconds) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = Math.floor(seconds % 60);
    return `${minutes}:${remainingSeconds.toString().padStart(2, "0")}`;
  };

  // Player event handlers
  const onReady = (event) => {
    playerRef.current = event.target;
    setDuration(event.target.getDuration());
  };

  const onStateChange = (event) => {
    setIsPlaying(event.data === 1);
    if (event.data === 1) {
      const interval = setInterval(() => {
        setCurrentTime(playerRef.current.getCurrentTime());
      }, 1000);
      return () => clearInterval(interval);
    }
  };

  // Control handlers
  const togglePlay = () => {
    if (isPlaying) {
      playerRef.current.pauseVideo();
    } else {
      playerRef.current.playVideo();
    }
    setIsPlaying(!isPlaying);
  };

  const handleSeek = (e) => {
    const newTime = e.target.value;
    playerRef.current.seekTo(newTime);
    setCurrentTime(newTime);
  };

  const handleVolume = (e) => {
    const newVolume = parseInt(e.target.value);
    playerRef.current.setVolume(newVolume);
    setVolume(newVolume);
    setIsMuted(newVolume === 0);
  };

  const toggleMute = () => {
    if (isMuted) {
      playerRef.current.unMute();
      playerRef.current.setVolume(volume);
    } else {
      playerRef.current.mute();
    }
    setIsMuted(!isMuted);
  };

  return (
    <div className="flex h-screen bg-gray-900 text-white relative">
      <div className="flex w-full transition-all duration-300">
        {/* Video Player Section */}
        <div className={`transition-all duration-300 ${chatOpen ? "w-1/3" : "w-1/2"}`}>
          <div className="h-full flex flex-col bg-gray-800">
            <div className="flex-1 p-4">
              <YouTube
                videoId={videoId}
                opts={opts}
                onReady={onReady}
                onStateChange={onStateChange}
                className="w-full h-full rounded-lg shadow-lg"
                iframeClassName="w-full h-full rounded-lg"
              />
            </div>

            {/* Custom Controls */}
            <div className="p-4 bg-gray-800 border-t border-gray-700">
              <div className="flex items-center gap-2 mb-4">
                <span className="text-sm">{formatTime(currentTime)}</span>
                <input
                  type="range"
                  min="0"
                  max={duration}
                  value={currentTime}
                  onChange={handleSeek}
                  className="flex-1 h-2 bg-gray-700 rounded-lg appearance-none cursor-pointer"
                />
                <span className="text-sm">{formatTime(duration)}</span>
              </div>

              <div className="flex items-center justify-center">
                <div className="flex items-center justify-center gap-4">
                  <button
                    onClick={togglePlay}
                    className="p-2 hover:bg-gray-700 rounded-full transition-colors"
                  >
                    {isPlaying ? <Pause size={24} /> : <Play size={24} />}
                  </button>

                  <div className="flex items-center gap-2">
                    <button
                      onClick={toggleMute}
                      className="p-2 hover:bg-gray-700 rounded-full transition-colors"
                    >
                      {isMuted ? <VolumeX size={24} /> : <Volume2 size={24} />}
                    </button>
                    <input
                      type="range"
                      min="0"
                      max="100"
                      value={isMuted ? 0 : volume}
                      onChange={handleVolume}
                      className="w-24 h-2 bg-gray-700 rounded-lg appearance-none cursor-pointer"
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Lyrics Section with Gallery */}
        <div className={`transition-all duration-300 ${chatOpen ? "w-1/3" : "w-1/2"}`}>
          <div className="h-full bg-gray-900">
            <LyricsGallery lyrics={data} LyricsLoaded={LyricsLoaded} />
          </div>
        </div>

        {/* Chat Section */}
        <div
          className={`w-1/3 bg-gray-800 transition-all duration-300 ${
            chatOpen ? "translate-x-0" : "translate-x-full"
          } fixed right-0 top-0 h-full`}
        >
          <div className="flex flex-col h-full p-4">
            <div className="flex justify-between items-center mb-2">
              <h2 className="text-xl font-bold">Chat</h2>
              <button
                onClick={toggleChat}
                className="text-gray-400 hover:text-gray-200"
              >
                ×
              </button>
            </div>
            <div className="relative flex-1">
              <iframe
                className="absolute inset-0 h-full w-full bg-black-500 z-40 rounded-lg"
                src={import.meta.env.VITE_CHATBOT_URL}
                style={{ border: "none" }}
              />
            </div>
          </div>
        </div>
      </div>

      {!chatOpen && (
        <button
          onClick={toggleChat}
          className="absolute bottom-4 right-4 bg-blue-600 text-white p-2 rounded-full shadow-lg hover:bg-blue-700 focus:outline-none"
        >
          Chat
        </button>
      )}
    </div>
  );
};

export default Vidpage;