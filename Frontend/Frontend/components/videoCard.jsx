import React from "react";

const VideoCard = ({ video,HandleClick }) => {
    function decodeHTML(str) {
      const textarea = document.createElement("textarea");
      textarea.innerHTML = str;
      return textarea.value;
    }
    return (
        <div
          className="flex items-center bg-gray-800 bg-opacity-50 rounded-lg overflow-hidden shadow-lg transform transition-all hover:scale-105 cursor-pointer w-full h-12 md:h-24"
          onClick={() => HandleClick(video.id.videoId,video.snippet.title,video.snippet.description)}
        >
          {/* <img src={video.snippet.thumbnails.default.url} alt={video.snippet.title} className="w-14 h-14 md:w-24 md:h-24 object-cover" />
          <div className="p-3 md:p-4 flex-1 items-end">
            <h3 className="text-sm md:text-lg font-semibold truncate text-white">{video.snippet.title}</h3>
          </div> */}
          <div class="flex items-center gap-4 p-3 hover:bg-white/10 rounded-xl transition-all duration-200 cursor-pointer group">
            <div className="w-12 h-12 bg-gradient-to-r from-pink-500 to-violet-500 rounded-md flex items-center justify-center flex-shrink-0"> <span className="material-symbols-outlined text-white">music_note</span> </div>
            <div className="flex-grow min-w-0">
               <h3 className="text-white font-medium truncate">{decodeHTML(video.snippet.title)}</h3>
               <p className="text-gray-400 text-sm truncate">{decodeHTML(video.snippet.channelTitle)}</p>
            </div>
            <button className="w-10 h-10 flex items-center justify-center text-white bg-white/0 hover:bg-white/20 rounded-full transition-all duration-200"> <span className="material-symbols-outlined">play_arrow</span> </button> 
         </div>
          
        </div>
      );
  }

export default VideoCard