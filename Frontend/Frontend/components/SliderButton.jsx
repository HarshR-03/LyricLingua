import { MdChevronRight } from "react-icons/md";
export default function SliderButton({func}){
    return(
        <button onClick={func} className="bg-brand-500 hover:bg-brand-600 active:bg-brand-700 dark:bg-brand-400 dark:hover:bg-brand-300 dark:active:bg-brand-200 flex items-center justify-center rounded-full p-2 text-3xl text-white transition duration-200 hover:cursor-pointer dark:text-white">
        <MdChevronRight />
        </button>
    )
}