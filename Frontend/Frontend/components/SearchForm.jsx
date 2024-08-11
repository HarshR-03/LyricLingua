import React from "react";

const SearchForm = ({searchTerm,setSearchTerm,searchHandler})=>{
    return (
            <div className="flex flex-col mt-0 space-y-3 sm:space-y-0 sm:flex-row sm:justify-center sm:-mx-2">
                <input type="text" className="px-4 py-2 text-gray-700 bg-white border rounded-md sm:mx-2 dark:bg-gray-900 dark:text-gray-300 dark:border-gray-600 focus:border-blue-400 dark:focus:border-blue-300 focus:outline-none focus:ring focus:ring-blue-300 focus:ring-opacity-40" placeholder="Search Song"
                value={searchTerm}
                onChange={(e)=>{
                    setSearchTerm(e.target.value);
                }}/>

                <button className="px-4 py-2 text-sm font-medium tracking-wide text-white capitalize transition-colors duration-300 transform bg-blue-700 rounded-md sm:mx-2 hover:bg-blue-600 focus:outline-none focus:bg-blue-600"
                onClick={searchHandler}>
                    Search
                </button>
            </div>
        )
}

export default SearchForm