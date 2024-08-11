import React from "react"
import SearchForm from "./SearchForm"

const Header = ({searchTerm,setSearchTerm,searchHandler})=>{
    return (
        <header className="border-b border-gray-200 bg-gray-200 bg-opacity-50">
  <div className="mx-auto max-w-screen-xl px-3 py-3 sm:px-4 sm:py-6 lg:px-8">
    <div className="flex flex-col items-start gap-4 md:flex-row md:items-center md:justify-between">
      <div>
        <h1 className="text-2xl font-bold text-gray-900 sm:text-3xl">Music Player</h1>
      </div>
      <SearchForm searchTerm={searchTerm} setSearchTerm={setSearchTerm} searchHandler={searchHandler}/> 
      <div className="flex items-center gap-4">

      </div>
    </div>
  </div>
</header>
    )
}

export default Header