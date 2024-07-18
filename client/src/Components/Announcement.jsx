import { IoMdMegaphone } from "react-icons/io";

function Announcement({text}) {
  return (
    <div className="bg-light-bg flex items-center gap-2 w-full text-[17px] phone:text-sm p-[2px] font-semibold rounded-lg">
        <div>
            <IoMdMegaphone className="phone:text-base text-xl" />
        </div>
        <marquee>{text}</marquee>
    </div>
  )
}

export default Announcement