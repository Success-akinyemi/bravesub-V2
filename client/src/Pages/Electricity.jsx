import { useEffect, useState } from "react";
import { FaArrowLeftLong } from "react-icons/fa6";
import { Link } from "react-router-dom";
import Announcement from "../Components/Announcement";

function Electricity({formData, setformData, setSelectedCard, providerIcon, providerName, meterType}) {
    const [ isAnnouncement, setIsAnnouncement ] = useState(true)
    const [ meterIdErrorText, setMeterIdErrorText ] = useState(null)
    const [ amountErrorText, setAmountErrorText ] = useState(null)
    const [ isAddToList, setIsAddToList ] = useState(true)



    const handleServices = () => {
        setSelectedCard('electricServiceProviders')
    }

    const addToList = () => {
        setIsAddToList((prev) => !prev)
    }

    const handleMeterType = () => {
        setSelectedCard('electricMeterType')
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
            Electricity
          </h2>
        </div>
      </div>

      {isAnnouncement && (
        <div className="mt-[50px]">
          <Announcement text="Pay Electric bills directly from whatsapp with BraveLite" />
        </div>
      )}

      {/**MAIN */}
      {/**Service providers */}
      <div className={`${isAnnouncement ? 'mt-[15px]' : 'mt-[50px]' } flex flex-col relative w-full overflow-x-hidden bg-white rounded-3xl p-3`}>
        <div className={`flex items-center justify-between cursor-pointer p-2 border-b-[1px] border-b-gray-400`} onClick={handleServices}>
            <div className="flex items-center gap-[4px]">
                <img src={providerIcon} alt='' className="w-[15px]" />
                <h2 className="font-semibold">{providerName}</h2>
            </div>
            
            <div>

            </div>
        </div>

        <div className="w-full p-2">
            <p className="text-[12px] phone:text-[11px] text-gray-500">Ensure you have validated your KYC online to be able to recharge your meter</p>
        </div>
      </div>

      {/**Payment item */}
      <div className="mt-[2rem] flex flex-col relative w-full overflow-x-hidden bg-white rounded-3xl p-3">
        <p>Payment Items</p>
        <div  onClick={handleMeterType} className="flex items-center justify-between p-2 border-b-[1px] border-b-gray-400">
            <p className="text-[24px] font-semibold">{meterType}</p>
            <div></div>
        </div>

        <div className="mt-4 flex flex-col">
            <span>Meter Number</span>
            <div className="relative w-full flex items-center">
                <input className="w-full" />
            </div>
        </div>

        <div className="w-full flex items-center justify-between mt-4">
            <p className="text-[14px] phone:text-[12px]">Save to histroy list</p>
            <div onClick={addToList} className={`bg-gray-400 pl-[4px] pr-[4px] pt-[5px] pb-[5px] small-phone:pt-[3px] small-phone:pb-[3px] w-[45px] small-phone:w-[40px] h-[26px] small-phone:h-[20px] flex items-center rounded-xl cursor-pointer relative ${isAddToList ? 'bg-green-500': '' }`}>
                <div className={`h-[20px] w-[20px] small-phone:h-[15px] small-phone:w-[15px] bg-white  rounded-full  ${isAddToList ? 'absolute right-1' : ''}`}></div>
            </div>
        </div>
      </div>

    </div>
  );
}

export default Electricity;
