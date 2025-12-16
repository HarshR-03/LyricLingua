import React, { useState,useEffect } from "react";
import { useNavigate,useLocation,useSearchParams } from "react-router-dom";
// import {useHistory} from "react-router-dom";
// import Header from "./Header.jsx"
import VideoCard from "./videoCard.jsx";
import SearchForm from "./SearchForm.jsx";
import aotop2 from "../assets/aotop2.jpg"
import gurenge from "../assets/gurenge.jpg"
import unravel from "../assets/unravel.jpg"



const SearchPage = ()=>{
    const [searchParams] = useSearchParams()
    const [searchTerm,setSearchTerm] = useState(searchParams.get('q')||'')
    const [videos,setVideos] = useState(null)
    const location = useLocation();
    const navigate = useNavigate();
    
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
            console.log("search data: ",d);
            e.preventDefault();
            // const vidData = await fetch('https://lyriclingua.onrender.com/app/',{
            const vidData = await fetch('/backend-api/app/',{
                method:'post',
                body:JSON.stringify({
                    "q":`${searchTerm}`,
                    "max_results":10,
                    "categoryId":10
                })
                }
            )
            console.log("viddata:",vidData);
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
        <div className="w-full min-h-screen bg-gradient-to-br from-purple-900 via-indigo-900 to-pink-900 p-4 md:p-8">
            <div className="max-w-6xl mx-auto">
                <header className="text-center mb-12 md:mb-16">
                    <div className="inline-flex items-center gap-3 mb-6">
                        <div className="w-12 h-12 md:w-16 md:h-16 bg-gradient-to-r from-pink-500 to-violet-500 rounded-full flex items-center justify-center transform hover:scale-110 transition-all duration-300"> <span className="material-symbols-outlined text-white text-2xl md:text-3xl">music_note</span> </div>
                        <h1 className="text-3xl md:text-5xl font-bold text-white bg-gradient-to-r from-pink-400 to-violet-400 bg-clip-text text-transparent"> LyricLingua </h1>
                    </div>
                    <p className="text-gray-300 text-lg md:text-xl max-w-2xl mx-auto">Learn japanese through anime songs and J-pop hits </p>
                </header>
                <div className="mb-12 md:mb-16">
                    <SearchForm searchTerm={searchTerm} setSearchTerm={setSearchTerm} searchHandler={searchHandler}/>
                </div>

                {/* <Header searchTerm={searchTerm} setSearchTerm={setSearchTerm} searchHandler={searchHandler}/> */}
                    
                <div class="max-w-2xl mx-auto mt-8 search-results">
                        {/* <div className="flex flex-col items-center justify-center w-5/6 md:w-3/4 mx-auto mt-4 bg-white bg-opacity-50 p-4 md:p-6 rounded-lg gap-1"> */}
                        <div class="bg-white/10 backdrop-blur-md rounded-2xl p-6 border border-white/20">
                            <div class="flex justify-between items-center mb-6">
                                <h2 class="text-xl md:text-2xl font-bold text-white">Search Results</h2>
                                <span class="text-gray-400 text-sm">{videos? videos.length: 0} results found</span> 
                            </div>
                    <div className="space-y-2">
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
                    {/* <div class="flex justify-center mt-8">
                     <div class="flex items-center gap-2"> <button class="w-10 h-10 flex items-center justify-center bg-white/10 hover:bg-white/20 rounded-full transition-all duration-200"> <span class="material-symbols-outlined text-white">chevron_left</span> </button> <button class="w-10 h-10 flex items-center justify-center bg-gradient-to-r from-pink-500 to-violet-500 rounded-full text-white">1</button> <button class="w-10 h-10 flex items-center justify-center bg-white/10 hover:bg-white/20 rounded-full transition-all duration-200 text-white">2</button> <button class="w-10 h-10 flex items-center justify-center bg-white/10 hover:bg-white/20 rounded-full transition-all duration-200 text-white">3</button> <button class="w-10 h-10 flex items-center justify-center bg-white/10 hover:bg-white/20 rounded-full transition-all duration-200"> <span class="material-symbols-outlined text-white">chevron_right</span> </button> </div>
                  </div> */}
                    </div>
                    </div>
                    <div className="mt-2 md:mt-4 mb-12 md:mb-16">
                        <CategoryCards/>
                    </div>
                <div className="mb-12">
                    <PopularSongsCards/>
                </div>
            </div>
        </div>
    )
}

const CategoryCards = ()=>{
    return(      
    <>
         <h2 className="text-2xl md:text-3xl font-bold text-white mb-8 text-center">Popular Categories</h2>
         <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
            <div className="bg-white/10 backdrop-blur-md rounded-xl p-6 border border-white/20 hover:bg-white/20 transition-all duration-300 hover:scale-105 cursor-pointer group">
               <div className="text-center">
                  <div className="w-16 h-16 mx-auto mb-4 bg-gradient-to-r from-red-500 to-orange-500 rounded-full flex items-center justify-center group-hover:rotate-12 transition-transform duration-300"> <span class="material-symbols-outlined text-white text-2xl">audiotrack</span> </div>
                  <h3 className="text-white font-semibold text-lg mb-2">Opening Themes</h3>
                  <p className="text-gray-400 text-sm">Epic anime openings</p>
               </div>
            </div>
            <div className="bg-white/10 backdrop-blur-md rounded-xl p-6 border border-white/20 hover:bg-white/20 transition-all duration-300 hover:scale-105 cursor-pointer group">
               <div className="text-center">
                  <div className="w-16 h-16 mx-auto mb-4 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-full flex items-center justify-center group-hover:rotate-12 transition-transform duration-300"> <span class="material-symbols-outlined text-white text-2xl">bedtime</span> </div>
                  <h3 className="text-white font-semibold text-lg mb-2">Ending Themes</h3>
                  <p className="text-gray-400 text-sm">Beautiful anime endings</p>
               </div>
            </div>
            <div className="bg-white/10 backdrop-blur-md rounded-xl p-6 border border-white/20 hover:bg-white/20 transition-all duration-300 hover:scale-105 cursor-pointer group">
               <div className="text-center">
                  <div className="w-16 h-16 mx-auto mb-4 bg-gradient-to-r from-green-500 to-emerald-500 rounded-full flex items-center justify-center group-hover:rotate-12 transition-transform duration-300"> <span class="material-symbols-outlined text-white text-2xl">landscape</span> </div>
                  <h3 className="text-white font-semibold text-lg mb-2">OSTs</h3>
                  <p className="text-gray-400 text-sm">Background music</p>
               </div>
            </div>
            <div className="bg-white/10 backdrop-blur-md rounded-xl p-6 border border-white/20 hover:bg-white/20 transition-all duration-300 hover:scale-105 cursor-pointer group">
               <div className="text-center">
                  <div className="w-16 h-16 mx-auto mb-4 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full flex items-center justify-center group-hover:rotate-12 transition-transform duration-300"> <span class="material-symbols-outlined text-white text-2xl">star</span> </div>
                  <h3 className="text-white font-semibold text-lg mb-2">J-Pop Hits</h3>
                  <p className="text-gray-400 text-sm">Popular Japanese songs</p>
               </div>
            </div>
         </div>
         </>
    )
}

const PopularSongsCards = ()=>{
    return(
        <>
         <h2 className="text-2xl md:text-3xl font-bold text-white mb-8 text-center">Trending Now</h2>
         <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <div className="bg-white/10 backdrop-blur-md rounded-xl overflow-hidden border border-white/20 hover:bg-white/20 transition-all duration-300 hover:scale-105 cursor-pointer group">
               <div className="aspect-video bg-gradient-to-r from-pink-500 to-violet-500 relative overflow-hidden">
                <img
                    src={gurenge}
                    alt={`gurenge thumbnail`}
                    className="absolute top-0 left-0 w-full h-full object-cover z-0 transition-opacity duration-300 group-hover:opacity-80"
                    loading="lazy"
                    />
                  <div class="absolute inset-0 flex items-center justify-center"> <span class="material-symbols-outlined text-white text-4xl group-hover:scale-110 transition-transform duration-300">play_circle</span> </div>
               </div>
               <div className="p-4">
                  <h3 className="text-white font-semibold mb-1">Gurenge</h3>
                  <p className="text-gray-400 text-sm mb-2">Demon Slayer Opening</p>
                  <p className="text-pink-400 text-xs">LiSA</p>
               </div>
            </div>
            <div className="bg-white/10 backdrop-blur-md rounded-xl overflow-hidden border border-white/20 hover:bg-white/20 transition-all duration-300 hover:scale-105 cursor-pointer group">
               <div className="aspect-video bg-gradient-to-r from-blue-500 to-cyan-500 relative overflow-hidden">
                <img
                    src={unravel}
                    alt={`unravel thumbnail`}
                    className="absolute top-0 left-0 w-full h-full object-cover z-0 transition-opacity duration-300 group-hover:opacity-80"
                    loading="lazy"
                    />
                  <div class="absolute inset-0 flex items-center justify-center"> <span class="material-symbols-outlined text-white text-4xl group-hover:scale-110 transition-transform duration-300">play_circle</span> </div>
               </div>
               <div className="p-4">
                  <h3 className="text-white font-semibold mb-1">Unravel</h3>
                  <p className="text-gray-400 text-sm mb-2">Tokyo Ghoul Opening</p>
                  <p className="text-pink-400 text-xs">TK from Ling tosite sigure</p>
               </div>
            </div>
            <div className="bg-white/10 backdrop-blur-md rounded-xl overflow-hidden border border-white/20 hover:bg-white/20 transition-all duration-300 hover:scale-105 cursor-pointer group">
               <div className="aspect-video bg-gradient-to-r from-orange-500 to-red-500 relative overflow-hidden">
               <img
                src={aotop2}
                alt={`shinzou wo sasageyo thumbnail`}
                className="absolute top-0 left-0 w-full h-full object-cover z-0 transition-opacity duration-300 group-hover:opacity-80"
                loading="lazy"
                />
                  <div className="absolute inset-0 flex items-center justify-center"> 
                    <span className="material-symbols-outlined text-white text-4xl group-hover:scale-110 transition-transform duration-300">play_circle</span> 
                    </div>
               </div>
               <div className="p-4">
                  <h3 className="text-white font-semibold mb-1">Shinzou wo Sasageyo</h3>
                  <p className="text-gray-400 text-sm mb-2">Attack on Titan Opening</p>
                  <p className="text-pink-400 text-xs">Linked Horizon</p>
               </div>
            </div>
         </div>
      </>
    )
}


export default SearchPage


// <div className="bg-[url('../assets/wp1.jpg')] bg-cover bg-[60%] h-[100vh]">
//         <Header searchTerm={searchTerm} setSearchTerm={setSearchTerm} searchHandler={searchHandler}/>
//         <div >
//             <div className="flex flex-col items-center justify-center w-5/6 md:w-3/4 mx-auto mt-4 bg-white bg-opacity-50 p-4 md:p-6 rounded-lg gap-1">
//             {videos!=null ? 
//                 videos.map((video)=>{
//                     // return <div key={video.id.videoId} onClick={()=>{HandleClick(video.id.videoId)}}>
//                     // <img src={video.snippet.thumbnails.default.url}/>
//                     // <div className="text-amber-500">{video.snippet.title}</div>
//                     // </div>
//                     return <VideoCard key={video.id.videoId} video={video} HandleClick={HandleClick} />

//                 }) :
//                 (<p className="text-white">Try searching for something!</p>)
//             }
//             </div>
//         </div>
//          </div>