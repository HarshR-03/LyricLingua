import React from "react";

const VideoCard = ({ video,HandleClick }) => {
    return (
        <div
          className="flex items-center bg-gray-800 bg-opacity-50 rounded-lg overflow-hidden shadow-lg transform transition-all hover:scale-105 cursor-pointer w-full h-24"
          onClick={() => HandleClick(video.id.videoId,video.snippet.title,video.snippet.description)}
        >
          <img src={video.snippet.thumbnails.default.url} alt={video.snippet.title} className="w-24 h-24 object-cover" />
          <div className="p-4 flex-1">
            <h3 className="text-lg font-semibold text-white">{video.snippet.title}</h3>
          </div>
        </div>
      );
  }

export default VideoCard