import React, { useState,useEffect } from "react";
import { useNavigate,useLocation,useSearchParams } from "react-router-dom";
// import {useHistory} from "react-router-dom";
import wp1 from '../assets/wp1.jpg'
import Header from "./Header.jsx"
import VideoCard from "./videoCard.jsx";

const SearchPage = ()=>{
    const [searchParams] = useSearchParams()
    const [searchTerm,setSearchTerm] = useState(searchParams.get('q')||'')
    const [videos,setVideos] = useState(null)
    const location = useLocation();
    const navigate = useNavigate()

    
  useEffect(() => {
    const query = searchParams.get('q');
    const encodedVideos = searchParams.get('videos');
    console.log("inside hook first:",encodedVideos)
    console.log(typeof encodedVideos)
    if (query) {
      setSearchTerm(query);
      if (encodedVideos) {
        try {
          const decodedVideos = JSON.parse(decodeURIComponent(encodedVideos));
          console.log("inside useeffect: ", decodedVideos)
          console.log(typeof decodedVideos)
          setVideos(decodedVideos);
        } catch (error) {
          console.error("Error decoding videos from URL:", error);
          setError("Error loading saved search results.");
        }
      }
    }
  }, [location]);


    async function searchHandler(e){
        try{
            const d = {
                "q":`${searchTerm}`,
                "max_results":5,
                "categoryId":10
            }
            console.log(d);
            e.preventDefault();
            const vidData = await fetch('https://lyriclingua.onrender.com/app/',{
                method:'post',
                body:JSON.stringify({
                    "q":`${searchTerm}`,
                    "max_results":10,
                    "categoryId":10
                })
                }
            )
            if (!vidData.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            const response = await vidData.json()
            response.map((video)=>{
                console.log(video.snippet.title)
            })

            setVideos(response);
            const encodedVideos = encodeURIComponent(JSON.stringify(response));
            console.log(`encoded videos: ${encodedVideos}`);
            navigate(`?q=${encodeURIComponent(searchTerm)}&videos=${encodedVideos}`);
        }
        catch(err){
            console.log(err.message);
        }
    }

    const HandleClick = (id,title,desc)=>{
        navigate(`/video/${id}`,{state:{title,desc}})
    }
    return (
        <div className="bg-cover bg-fixed w-full min-h-screen"
            style={{ 
                backgroundImage: `url(${wp1})`
            }}>
        <Header searchTerm={searchTerm} setSearchTerm={setSearchTerm} searchHandler={searchHandler}/>
        <div >
            <div className="flex flex-col items-center justify-center w-3/4 mx-auto mt-4 bg-white bg-opacity-50 p-6 rounded-lg">
            {videos!=null ? 
                videos.map((video)=>{
                    // return <div key={video.id.videoId} onClick={()=>{HandleClick(video.id.videoId)}}>
                    // <img src={video.snippet.thumbnails.default.url}/>
                    // <div className="text-amber-500">{video.snippet.title}</div>
                    // </div>
                    return <VideoCard key={video.id.videoId} video={video} HandleClick={HandleClick} />

                }) :
                (<p className="text-white">Try searching for something!</p>)
            }
            </div>
        </div>
         </div>
    )
}

export default SearchPage
