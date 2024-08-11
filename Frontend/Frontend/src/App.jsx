import React from "react";
import PropTypes from "prop-types";
import SearchPage from "../components/searchPage";
import YoutubeEmbed from "../components/videoPage";
import {BrowserRouter, Route,Routes} from 'react-router-dom'

const App = ()=>{
  return(
    <Routes>
      <Route path="/" element={<SearchPage/>}/>
      <Route path="/video/:videoId" element={<YoutubeEmbed/>}/>
    </Routes>
  )
}

export default App;