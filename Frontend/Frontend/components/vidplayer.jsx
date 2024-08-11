import React from "react";

const VideoPlayer = ({videoId})=>{
        return (<div className="rounded-md overflow-hidden w-[min(640px,100%)] aspect-[44/25]"  >
          <iframe className="w-full h-full"
            width="853"
            height="480"
            src={`https://www.youtube.com/embed/${videoId}`}
            frameBorder="0"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
            title="Embedded youtube"
          />
        </div>)
}
export default VideoPlayer