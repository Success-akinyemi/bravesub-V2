import { Link } from "react-router-dom";
import FootNav from "../Components/FootNav"
import { FaArrowLeftLong } from "react-icons/fa6";
import { airtimeNetworks, airtimeServices, someAirtime } from "../data/airtime";
import FlameImag from '../assets/flame.png'
import LogoImg from '../assets/logo.png'
import { useEffect, useState } from "react";
import { IoMdCloseCircle } from "react-icons/io";
import Announcement from "../Components/Announcement";
import { IoMdArrowDropdown } from "react-icons/io";
import { IoMdPerson } from "react-icons/io";
import Banner from "../Components/Banner";
import { IoIosArrowForward } from "react-icons/io";
import { useSelector } from "react-redux";

function Airtime({setSelectedCard, formData, setformData}) {
  const { currentUser } = useSelector((state) => state.braveSubUser);
  const user = currentUser?.data
  const cashPoint = user.cashPoint
  const [ airtimeValue, setAirtimeValue ] = useState()
  const [ phoneNumber, setPhoneNumber ] = useState()
  const [ isAnnouncement, setIsAnnouncement ] =useState(true)
  const [ isOpen, setIsOpen ] = useState(false) 
  const [isFocused, setIsFocused] = useState(false);
  const [prevNumber, setPrevNumber] = useState(false);
  const [isAmountFocused, setIsAmountFocused] = useState(false);
  const networks = airtimeNetworks
  const[ logo, setLogo] = useState(networks[0].icon)
  useEffect(() => {
    setformData({...formData, icon: networks[0].icon, networkCode: networks[0]?.code, network: networks[0]?.network })
  }, [])
  
  //ERRORS
  const [ phoneNumberError, setPhoneNumberError ] = useState(null)
  const [ airtimeValueError, setAirtimeValueError ] = useState(null)

  //previous phone numbers
  const bravesubuserphonenumber = JSON.parse(localStorage.getItem('bravesubuserphonenumber')) || [];


  useEffect(() => {console.log(formData)}, [formData])

  const handleAirtimeInput = (e) => {
    setAirtimeValueError(null)
    setAirtimeValue(e.target.value)
    setformData({...formData, airtimeValue: e.target.value})
  }

  const setQuickPhoneNuber = (number) => {
    console.log(' NUMBER')
    setPhoneNumberError(null)
    setPhoneNumber()
    setformData({...formData, phoneNumber: ''})
    setPhoneNumber(number)
    setformData({...formData, phoneNumber: number})
    setPrevNumber(false)
  }

  const handlePhoneNumberInput = (e) => {
    setPhoneNumberError(null)
    setPhoneNumber(e.target.value)
    setformData({...formData, phoneNumber: e.target.value})
  }

  const selectAirtime = (value) => {
    setAirtimeValue(value)
    setformData({...formData, airtimeValue: value})
    if(!formData.phoneNumber){
      setPhoneNumberError('Enter Phone Number')
      return;
    }

    setSelectedCard('airtimePopup')
  }

  const handleBuy = () => {
    if(!formData.phoneNumber){
      setPhoneNumberError('Enter Phone Number')
      return;
    }
    if(!formData.airtimeValue){
      setAirtimeValueError('Enter Amount of Airtime')
      return;
    }

    setSelectedCard('airtimePopup')
  }



  const removeAmount = () => {
    setAirtimeValue('')
    setformData({...formData, airtimeValue: ''})
  }

  const removePhoneNumber = () => {
    setPhoneNumber('')
    setformData({...formData, phoneNumber: ''})
  }

  const toggleNetworkSelect = () => {
    setIsOpen((prev) => !prev)
  }

  const selectNetwork = (item) => {
    setLogo(item?.icon)
    setformData({...formData, icon: item?.icon, networkCode: item?.code, network: item?.network})
    setIsOpen(false)
  }

  const removePhoneNumberFromStorage = (number) => {
    const updatedNumbers = bravesubuserphonenumber.filter(item => item.phoneNumber !== number);
    localStorage.setItem('bravesubuserphonenumber', JSON.stringify(updatedNumbers));
  };

  return (
    <div className="page pt-0">
        {/**HEADER */}
        <div className="pagination w-full bg-white h-[50px] fixed left-0 right-0 flex items-center justify-between z-10">
            <div className="flex items-center gap-3 small-phone:gap-[10px]">
                <Link className="" to={'/dashboard'}>
                    <FaArrowLeftLong className="text-[25px] small-phone:text-[20px]" />
                </Link>
                <h2 className="text-[20px] phone:[17px] small-phone:text-[15px] font-semibold">
                    Top up Airtime
                </h2>
            </div>

        </div>
        {
          isAnnouncement && (
            <div className="mt-[50px]">
              <Announcement text='Dear MTN users, MTN network is currently down' />
            </div>
          )
        }
        {/**Phone Number Section */}
        <div className={`pagination ${isAnnouncement ? 'mt-[5px]' : 'mt-[50px]' } w-[100vw] bg-white flex flex-col mb-5 absolute left-0 pt-6 pb-6 `}>
          <div className="flex flex-col relative">
            <div className="flex items-center gap-2 relative">
              <button className="flex items-center gap-1" onClick={toggleNetworkSelect}>
                <img src={logo} alt="logo" className="w-[45px] small-phone:w-[40px]" />
                <IoMdArrowDropdown className="text-[40px]" />
              </button>
              <input 
                placeholder="Enter Phone Number" 
                className="border-none focus:border-none text-[23px] phone:text-[20px] font-semibold" 
                value={phoneNumber}
                onChange={handlePhoneNumberInput}
                onFocus={() => setIsFocused(false)}
                onBlur={() => setIsFocused(false)}
              />
              {
                prevNumber && bravesubuserphonenumber.length > 0 && (
                  <div className="p-3 z-40 rounded-2xl bg-white shadow-2xl absolute right-8 top-6 small-phone:top-8">
                    {
                      bravesubuserphonenumber?.map((item) => (
                        <div key={item?.phoneNumber} onClick={() => setQuickPhoneNuber(item?.phoneNumber)} className=" flex items-center justify-between border-b-[3px] pb-2 pt-2">
                          <p className="font-bold text-gray-700 mr-[5rem] phone:mr-[2.5rem] w-full small-phone:text-[14px]" >{item.phoneNumber}</p>
                          <span className="text-gray-600 text-[15px] mr-[1rem] phone:text-[13px] small-phone:text-[11px]">{item.lastBought}</span>
                          <span
                            onClick={() => removePhoneNumberFromStorage(item.phoneNumber)}
                          >
                            <IoMdCloseCircle className="text-gray-600 cursor-pointer text-[18px] phone:text-[16px]" />
                          </span>
                        </div>
                      ))
                    }
                  </div>
                )
              }
              {
                isFocused && phoneNumber ? (
                  <IoMdCloseCircle onClick={removePhoneNumber} className="size-[30px] cursor-pointer text-gray-400" />

                ) : (
                  <IoMdPerson onClick={() => setPrevNumber((prev) => !prev)} className="text-main-color bg-light-bg p-[2px] text-[25px] rounded-[3px] font-bold" />
                )
              }
            </div>
            <hr className={`mt-1 border-[2px] phone:border-[1px] duration-500 ${isFocused ? 'border-[2px] phone:border-[1px] border-black' : ''} ${phoneNumberError ? 'border-[2px] phone:border-[1px] border-red-600' : ''} `} />
              {
                phoneNumberError && (
                  <p className="text-red-600 text-[15px] font-semibold">{phoneNumberError}</p>
                )
              }
          </div>

          {isOpen && (
            <div className="bg-white flex flex-col w-[200px] shadow-shadow2 rounded-[10px] absolute top-[6rem]">
              {
                networks.map((item, idx) => (
                  <div key={idx} onClick={() => selectNetwork(item)} className="flex items-center gap-3 p-4 border-b-2 cursor-pointer last-of-type:last:border-none">
                    <img src={item?.icon} alt={item?.network} className="w-[35px]" />
                    <p className="text-[17px] font-medium">{item?.network}</p>
                  </div>
                ))
              }
            </div>
          )}

          <p className="text-[14px] small-phone:text-[13px] text-gray-500">enjoy cashbacks on airtime every purchase - stay connected.</p>
        </div>
        
        {/**Top up */}
        <div className="mt-[10rem] bg-white pl-4 pr-4 pb-2 pt-1 w-full rounded-bl-3xl rounded-br-3xl">
          <div className="flex items-center gap-1 mb-3">
            <img src={FlameImag} className="w-[20px]" alt="image" />
            <p className="font-bold text-[14px]">Top up</p>
          </div>

          <div>

          </div>

          <div className="flex gap-2 flex-wrap justify-center">
            {
              someAirtime.map((item) => (
                <div onClick={() => selectAirtime(item?.price)} className="bg-gray-300 mb-2 w-[150px] small-phone:w-[110px] flex flex-col gap-2 items-center justify-center rounded-[10px] p-2 cursor-pointer">
                  <h2 className="flex gap-[3px] items-baseline">NGN <p className="text-[20px] small-phone:text-[18px] font-semibold">{item?.price}</p></h2>
                  <p className="text-[15px] phone:text-[11px] small-phone:text-[10px] font-semibold sm:text-[13px] text-main-color text-center">NGN {item?.cashback} Cashback</p>
                </div>
              ))
            }
          </div>



          <div className="flex items-end w-full gap-2 mt-3 mb-4">
            <div className="flex items-center w-full">
              <span className="font-bold">NGN</span>
              <input 
                placeholder="Enter Amount" 
                className=" border-none focus:border-none text-[23px] phone:text-[20px] small-phone:text-[18px] font-semibold" 
                value={airtimeValue} 
                onChange={handleAirtimeInput} 
                onFocus={() => setIsAmountFocused(true)}
                onBlur={() => setIsAmountFocused(false)}
              />
            </div>
            {
              airtimeValue && (
                <IoMdCloseCircle onClick={removeAmount} className="size-[30px] cursor-pointer text-gray-400" />
              )
            }
            <button onClick={handleBuy} className={`cursor-pointer text-white flex items-center justify-center font-semibold bg-main-color ${!airtimeValue ? 'bg-gray-200 cursor-not-allowed' : ''} pt-2 pb-2 pl-5 pr-5 small-phone:pt-1 small-phone:pb-1 small-phone:pl-3 small-phone:pr-3 rounded-[20px]`}>
              Buy
            </button>
          </div>

          <hr className={`mt-[-8px] border-[2px] ${isAmountFocused ? 'border-[2px] border-black' : ''} `} />
              {
                airtimeValueError && (
                  <p className="text-red-600 text-[15px] font-semibold">{airtimeValueError}</p>
                )
              }
          <div className="mt-4 text-[15px] phone:text-[13px] flex items-center gap-1 font-semibold">
            <img src={LogoImg} className="w-[20px] small-phone:w-[16px]" alt="logo" />
            <span className="text-[14px] text-yellow-500 small-phone:text-[12px]">{cashPoint} bravePoint</span><span>availble</span>
          </div>
        </div>

        {/**Airtime services */}
        <div className="rounded-3xl bg-white p-3 mt-[5rem] mb-[3rem]">
            <h2 className="font-semibold small-phone:text-[14px]" >Airtime Services</h2>

            <div className="flex flex-col gap-2 ml-8 mt-4">
              {airtimeServices.map((item) => (
                <Link className="flex items-center justify-between mb-2" to={`/${item?.link}`}>
                  <div className="flex flex-col">
                    <h3 className="font-semibold small-phone:text-[14px]">{item?.text}</h3>
                    <p className="text-[15px] phone:text-[14px] small-phone:text-[11px] text-gray-600 small-phone:text-gray-700">{item?.subtext}</p>
                  </div>
                  <IoIosArrowForward className="text-gray-600 text-[19px] small-phone:text-[15px]" />
                </Link>
              ))}
            </div>
            
        </div>

        <div className="mb-[7rem]">
          <Banner />
        </div>

        <FootNav />
    </div>
  )
}

export default Airtime