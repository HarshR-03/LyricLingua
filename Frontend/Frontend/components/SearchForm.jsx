import React from "react";

const SearchForm = ({searchTerm,setSearchTerm,searchHandler})=>{
    return (
            <div className="flex md:flex-col mt-0 space-y-3 sm:space-y-0 sm:flex-row sm:justify-center sm:-mx-2">
                {/* <input type="text" className="px-4 py-1 md:px-4 md:py-2 text-gray-700 bg-white border rounded-md sm:mx-2 dark:bg-gray-900 dark:text-gray-300 dark:border-gray-600 focus:border-blue-400 dark:focus:border-blue-300 focus:outline-none focus:ring focus:ring-blue-300 focus:ring-opacity-40" placeholder="Search Song"
                value={searchTerm}
                onChange={(e)=>{
                    setSearchTerm(e.target.value);
                }}/>

                <button className="px-2 py-2 md:px-4 md:py-2 text-sm font-medium tracking-wide text-white capitalize transition-colors duration-300 transform bg-blue-700 rounded-md sm:mx-2 hover:bg-blue-600 focus:outline-none focus:bg-blue-600"
                onClick={searchHandler}>
                    Search
                </button> */}
                <div className="relative max-w-2xl mx-auto">
                        <div className="absolute inset-0 bg-gradient-to-r from-pink-500 to-violet-500 rounded-2xl blur-sm opacity-30"></div>
                        <div className="relative bg-white/10 backdrop-blur-md rounded-2xl p-6 md:p-8 border border-white/20">
                        <div className="relative"> <span className="material-symbols-outlined absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 text-2xl"> search </span> 
                            <input type="text" placeholder="Search for anime songs, artists, or soundtracks..." 
                                value={searchTerm}
                                onChange={(e)=>{
                                    setSearchTerm(e.target.value);
                                }}
                                className="w-full pl-14 pr-16 py-4 md:py-5 bg-white/10 border border-white/20 rounded-xl text-white placeholder-gray-400 text-lg focus:outline-none focus:ring-2 focus:ring-pink-500 focus:border-transparent transition-all duration-300"/> 
                            <button onClick={searchHandler} className="absolute right-3 top-1/2 transform -translate-y-1/2 bg-gradient-to-r from-pink-500 to-violet-500 hover:from-pink-600 hover:to-violet-600 p-3 rounded-lg transition-all duration-300 hover:scale-105"> 
                            <span className="material-symbols-outlined text-white">arrow_forward</span> </button> </div>
                        </div>
                    </div>
            </div>
        )
}

export default SearchForm