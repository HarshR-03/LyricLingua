import React,{ useState } from "react"

function ChatbotPopup() {
  const [isOpen,setIsOpen] = useState(false);

  const handlepopup = ()=>{
    setIsOpen(!isOpen);
    console.log(isOpen);
  }
  return (
    <>
      <button onClick= {handlepopup} className="p-3 bg-neutral-800 opacity-70 absolute bottom-0 left-0 rounded-lg text-white">
        Helper Bot 
      </button>
      {isOpen && 
        <iframe className="absolute left-8 bottom-12 h-4/6 w-2/6 bg-black-500 z-40 rounded-lg"
          src="https://chtbotlyriclingua-cj6zydgvzabznvkjwqr3yn.streamlit.app/?embed=true"
        ></iframe>
        }
    </>
  )
}

export default ChatbotPopup
