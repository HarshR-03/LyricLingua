import React, { useState } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';

const LyricsGallery = ({ lyrics, LyricsLoaded }) => {
  const [currentIndex, setCurrentIndex] = useState(0);

  const navigateLeft = () => {
    setCurrentIndex(currentIndex === lyrics.length-1 ? 1 : currentIndex+1);
  };

  const navigateRight = () => {
    setCurrentIndex(currentIndex === 0 ?lyrics.length-1 : currentIndex-1);
  };

  return (
    <div className="relative h-full bg-gray-900 p-6 rounded-lg shadow-lg">
      <h2 className="text-3xl font-bold mb-4 text-center text-blue-500">Lyrics</h2>

      <div className="relative h-[calc(100%-4rem)] group transition-transform duration-300">
        {/* Lyrics Content */}
        <div 
          className="h-full overflow-y-auto px-6 py-4 bg-gray-800 rounded-lg shadow-inner"
          style={{ transition: 'opacity 0.5s ease' }}
          dangerouslySetInnerHTML={{ __html: (LyricsLoaded)? 
            (lyrics[currentIndex][0]=='[')? lyrics[currentIndex].slice(1,-1):lyrics[currentIndex]
            :
            lyrics
          }}
        />

        {/* Navigation Arrows */}
        <button 
          onClick={navigateLeft}
          className="absolute left-0 top-1/2 transform -translate-y-1/2 bg-gray-800/80 p-2 rounded-r-lg hover:bg-gray-700 transition-opacity"
        >
          <ChevronLeft size={24} className="text-white" />
        </button>
        
        <button 
          onClick={navigateRight}
          className="absolute right-0 top-1/2 transform -translate-y-1/2 bg-gray-800/80 p-2 rounded-l-lg hover:bg-gray-700 transition-opacity"
        >
          <ChevronRight size={24} className="text-white" />
        </button>
        
        {/* Language Indicator */}
        <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 bg-gray-800/80 px-4 py-1 rounded-full text-sm text-gray-300">
          {currentIndex === 0 ? 'Japanese' : 'English'}
        </div>
      </div>
    </div>
  );
};

export default LyricsGallery;