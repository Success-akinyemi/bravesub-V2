import { FaArrowLeftLong } from "react-icons/fa6"
import Announcement from "../Components/Announcement"
import { Link } from "react-router-dom"
import { useState } from "react"

function Tv({formData, setformData, setSelectedCard}) {
    const [ isAnnouncement, setIsAnnouncement ] = useState(false)

    const handleServices = () => {
        setSelectedCard('tvServiceProviders')
    }

  return (
    <div className="page pt-0">
      {/**HEADER */}
      <div className="pagination w-full bg-white h-[50px] fixed left-0 right-0 flex items-center justify-between z-10">
        <div className="flex items-center gap-3 small-phone:gap-[10px]">
          <Link className="" to={"/dashboard"}>
            <FaArrowLeftLong className="text-[25px] small-phone:text-[20px]" />
          </Link>
          <h2 className="text-[20px] phone:[17px] small-phone:text-[15px] font-semibold">
            Tv
          </h2>
        </div>
      </div>

      {isAnnouncement && (
        <div className="mt-[50px]">
          <Announcement text="subscribe your Tv on directly from whatsappp with BraveLite" />
        </div>
      )}
    </div>
  )
}

export default Tv