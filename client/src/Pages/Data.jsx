import { Link } from "react-router-dom"
import FootNav from "../Components/FootNav"
import Navbar from "../Components/Navbar"
import { FaArrowLeftLong } from "react-icons/fa6"
import { useEffect, useState } from "react"
import { IoMdArrowDropdown, IoMdCloseCircle, IoMdPerson } from "react-icons/io"
import Announcement from "../Components/Announcement"
import { dataNetworks } from "../data/data"
import DataPlans from "../Components/Helpers/DataPlans"

function Data({setSelectedCard, formData, setformData}) {
  const [ phoneNumber, setPhoneNumber ] = useState()
  const [ isAnnouncement, setIsAnnouncement ] =useState(true)
  const [ isOpen, setIsOpen ] = useState(false)
  const [isFocused, setIsFocused] = useState(false);
  const [prevNumber, setPrevNumber] = useState(false);
  const networks = dataNetworks
  const[ logo, setLogo] = useState(networks[0].icon)
  useEffect(() => {
    setformData({...formData, icon: networks[0].icon, networkCode: networks[0]?.code, network: networks[0]?.network })
  }, [])

  //ERRORS
  const [ phoneNumberError, setPhoneNumberError ] = useState(null)

  //previous phone numbers
  const bravesubuserphonenumber = JSON.parse(localStorage.getItem('bravesubuserphonenumber')) || [];

  const handlePhoneNumberInput = (e) => {
    setPhoneNumberError(null)
    setPhoneNumber(e.target.value)
    setformData({...formData, phoneNumber: e.target.value})
  }

  const setQuickPhoneNuber = (number) => {
    setPhoneNumberError(null)
    setPhoneNumber()
    setformData({...formData, phoneNumber: ''})
    setPhoneNumber(number)
    setformData({...formData, phoneNumber: number})
    setPrevNumber(false)
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
        <div className="pagination w-full bg-white h-[50px] fixed left-0 right-0 flex items-center justify-between z-10">
            <div className="flex items-center gap-3">
                <Link className="" to={'/dashboard'}>
                    <FaArrowLeftLong className="text-[25px]" />
                </Link>
                <h2 className="text-[20px] phone:[17px] font-semibold">
                    Buy Data
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
            <div className="flex items-center gap-2">
              <button className="flex items-center gap-1" onClick={toggleNetworkSelect}>
                <img src={logo} alt="logo" className="w-[45px]" />
                <IoMdArrowDropdown className="text-[40px]" />
              </button>
              <input 
                placeholder="Enter Phone Number" 
                className="border-none focus:border-none text-[23px] phone:text-[20px] font-semibold" 
                value={phoneNumber}
                onChange={handlePhoneNumberInput}
                onFocus={() => setIsFocused(true)}
                onBlur={() => setIsFocused(false)}
              />
              {
                prevNumber && bravesubuserphonenumber.length > 0 &&  (
                  <div className="p-3 z-40 rounded-2xl bg-white shadow-2xl absolute right-8 top-6">
                    {
                      bravesubuserphonenumber?.map((item) => (
                        <div key={item?.phoneNumber} onClick={() => setQuickPhoneNuber(item?.phoneNumber)} className=" flex items-center border-b-[3px] pb-2 pt-2">
                          <p className="font-bold text-gray-700 mr-[5rem] phone:mr-[2.5rem]" >{item.phoneNumber}</p>
                          <span className="text-gray-600 text-[15px] mr-[1rem] phone:text-[13px]">{item.lastBought}</span>
                          <span onClick={() => removePhoneNumberFromStorage(item.phoneNumber)}>
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
            <div className="bg-white flex flex-col w-[200px] shadow-shadow2 rounded-[10px] z-50 absolute top-[6rem]">
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

          <p className="text-[14px] text-gray-500">enjoy cashbacks on airtime every purchase - stay connected.</p>
        </div>
        
        <div className="mt-[10rem] flex flex-col relative w-full overflow-x-hidden bg-white rounded-3xl p-3">
          <div className="flex items-center w-full absolute top-0 left-0 bg-gradient-to-r from-purple-400 to-purple-500">
            <div className="bg-purple-700 z-10 rounded-br-3xl text-white font-bold sm:text-[14px] phone:text-[9px] pl-3 pt-1 pb-1 pr-1 phone:pr-8 phone:flex">Best Data <br /> Price</div>
            <div className="ml-[-5px] bg-purple-300 pl-4 pt-1 pb-1 pr-3 rounded-[4px] phone:w-full phone:text-[15px]">Get <span className="text-[19px] phone:text-[16px] font-bold text-yellow-700">Instant cashback</span> </div>
            <div className="phone:text-[13px] ml-3 font-medium">on every Purchase</div>           
          </div>
          <div className="mt-14">
            <DataPlans formData={formData} setformData={setformData} setSelectedCard={setSelectedCard} setPhoneNumberError={setPhoneNumberError}/>
          </div>
        </div>
        <FootNav />
    </div>
  )
}

export default Data