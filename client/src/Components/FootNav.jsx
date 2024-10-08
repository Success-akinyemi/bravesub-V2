import { BiHomeSmile } from "react-icons/bi";
import { BiSolidHomeSmile } from "react-icons/bi";
import { FaSquarePhone } from "react-icons/fa6";
import { FaPhone } from "react-icons/fa6";
import { MdOutlineNetworkWifi1Bar } from "react-icons/md";
import { MdNetworkWifi } from "react-icons/md";
import { IoPersonCircleOutline } from "react-icons/io5";
import { IoPersonCircle } from "react-icons/io5";
import { AiOutlineGift } from "react-icons/ai";
import { AiFillGift } from "react-icons/ai";
import { Link, useLocation } from "react-router-dom";

function FootNav() {
    {/**
        home
        airtime
        data   
        me
        reward 
    */}
    const loc = useLocation()
    const isActive = (path) => {
        return location.pathname === path
    }
  return (
    <div className="w-full md:pl-8 md:pr-8 phone:pl-4 phone:pr-4 shadow-shadow bg-white h-[64px] flex items-center justify-between fixed bottom-0 left-0">
        <Link className="flex flex-col items-center justify-center" to={'/dashboard'}>
            {
                isActive('/dashboard') ? (
                    <BiSolidHomeSmile className="text-[30px] phone:text-[27px] small-phone:text-[24px] text-main-color" />
                ) : (
                    <BiHomeSmile className="text-[30px] phone:text-[27px] small-phone:text-[24px]" />
                )
            }
            <p className={`font-semibold phone:text-[15px] small-phone:text-[13px] ${isActive('/dashboard') ? 'text-main-color' : ''}`}>Home</p>
        </Link>
        <Link className="flex flex-col items-center justify-center" to={'/airtime'}>
            {
                isActive('/airtime') ? (
                    <FaSquarePhone className="text-[25px] text-main-color" />
                ) : (
                    <FaPhone className="text-[25px]" />
                )
            }
            <p className={`font-semibold phone:text-[15px] small-phone:text-[13px] ${isActive('/airtime') ? 'text-main-color' : ''}`}>Airtime</p>
        </Link>
        <Link className="flex flex-col items-center justify-center" to={'/data'}>
            {
                isActive('/data') ? (
                    <MdNetworkWifi className="text-[28px] text-main-color" />
                ) : (
                    <MdOutlineNetworkWifi1Bar className="text-[28px]" />
                )
            }
            <p className={`font-semibold phone:text-[15px] small-phone:text-[13px] ${isActive('/data') ? 'text-main-color' : ''}`}>Data</p>
        </Link>
        <Link className="flex flex-col items-center justify-center" to={'/refer-and-earn'}>
            {
                isActive('/refer-and-earn') ? (
                    <AiFillGift className="text-[30px] phone:text-[27px] small-phone:text-[24px] text-main-color" />
                ) : (
                    <AiOutlineGift className="text-[30px] phone:text-[27px] small-phone:text-[24px]" />
                )
            }
            <p className={`font-semibold phone:text-[15px] small-phone:text-[13px] ${isActive('/refer-and-earn') ? 'text-main-color' : ''}`}>Reward</p>
        </Link>
        <Link className="flex flex-col items-center justify-center" to={'/profile'}>
            {
                isActive('/profile') ? (
                    <IoPersonCircle className="text-[30px] phone:text-[27px] small-phone:text-[24px] text-main-color" />
                ) : (
                    <IoPersonCircleOutline className="text-[30px] phone:text-[27px] small-phone:text-[24px]" />
                )
            }
            <p className={`font-semibold phone:text-[15px] small-phone:text-[13px] ${isActive('/profile') ? 'text-main-color' : ''}`}>Me</p>
        </Link>

    </div>
  )
}

export default FootNav