import { FaArrowLeftLong } from "react-icons/fa6"
import Announcement from "../Components/Announcement"
import { Link } from "react-router-dom"
import { useEffect, useState } from "react"
import { IoIosArrowDown, IoMdCloseCircle } from "react-icons/io"
import { FaRegAddressCard } from "react-icons/fa";
import { verifySmartCardName } from "../Helpers/api"

function Tv({formData, setformData, setSelectedCard, cableTvName, cableTvIcon}) {
    const [ isAnnouncement, setIsAnnouncement ] = useState(true)

    const [ cableTvError, setcableTvError ] = useState(null)
    const [ smartCardNumber, setSmartCardNumber ] = useState()
    const [ smartCardErrorText, setSmartCardErrorText ] = useState(null)

    const [ cableTvInputFocus, setCableTvInputFocus ] = useState(false)
    const [ prevCableTvCards, setPrevCableTvCards ] = useState(false)

    const [ isAddToList, setIsAddToList ] = useState(true)


    const [ verifiedCableTvUserName, setVerifiedCableTvUserName ] = useState()
    const [ fetchingUserDetails, setFetchingUserDetails ] = useState(false)

    //previous meter numbers
    const bravesubusercabletvsmartcards = JSON.parse(localStorage.getItem('bravesubusercabletvsmartcards')) || [];

    const removeCableTvSmartCardFromStorage = (number) => {
      const updatedNumbers = bravesubusercabletvsmartcards.filter(item => item.smartCard !== number);
      localStorage.setItem('bravesubusercabletvsmartcards', JSON.stringify(updatedNumbers));
    };

    const handleCableTvs = () => {
        setSelectedCard('tvServiceProviders')
    }

    useEffect(() => {
      console.log('FORM DATA', formData)

      if(formData.cableTvName){
        setcableTvError(null)
      }

      const fetchData = async () => {
        if(formData?.cableTvSlug && formData?.smartCardNumber){
          try {
            setFetchingUserDetails(true) 
            const res = await verifySmartCardName({ smartCardNumber: formData?.smartCardNumber, cableTvCode: formData?.cableTvSlug })
            if(res.success){
              setVerifiedCableTvUserName(res?.data);
            } else{
              setVerifiedCableTvUserName(res?.data);
            }
          } catch (error) {
            
          } finally{
            setFetchingUserDetails(false)
          }
        }
      }

      fetchData()
    }, [formData])

    const handleSmartCardInput = (e) => {
      setSmartCardErrorText(null)
      setSmartCardNumber(e.target.value)
      setformData({ ...formData, smartCardNumber: e.target.value})
    }

    const addToList = (prev) => {
      setIsAddToList((prev) => !prev)
      setformData({ ...formData, addMeterIdToList: !prev })
    }

    const removeSmartCard = () => {
      setSmartCardNumber('')
      setformData({...formData, smartCardNumber: ''})
    }

    const handleProceedToPay = () => {
      if(!formData.cableTvName){
        setcableTvError('Select a Biller')
        return
      }
      const regex = /^[0-9]+$/;
      if(!formData?.smartCardNumber){
        setSmartCardErrorText('Enter Smartcard Number')
        return
      }
      if(!regex.test(formData.smartCardNumber)){
        setSmartCardErrorText('Enter a valid meter number')
        return;
      }

      setSelectedCard('payCableTv')
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

      {/**Services Providers */}
      <div className={`${isAnnouncement ? 'mt-[15px]' : 'mt-[65px]' } flex flex-col relative w-full overflow-x-hidden bg-white rounded-3xl p-3`}>
        <div className={`flex items-center justify-between cursor-pointer p-2 border-b-[1px] ${cableTvError ? 'border-b-[2px] border-b-red-600' : 'border-b-gray-400'} `} onClick={handleCableTvs}>
            <div className="flex items-center gap-[4px]">
                <img src={cableTvIcon} alt='' className="w-[15px]" />
                <h2 className="font-semibold phone:text-[15px] small-phone:text-[14px]">{cableTvName}</h2>
            </div>
            
            <div>
              <IoIosArrowDown />
            </div>
        </div>
        {
                cableTvError && (
                  <p className="text-red-600 text-[15px] font-semibold">{cableTvError}</p>
                )
              }
        <div className="w-full p-2">
            <p className="text-[12px] phone:text-[11px] text-gray-500">Purchase tv recharge on bravesub from BraveLite on whatsapp</p>
        </div>
      </div>

      {/** Smart card number */}
      <div className="mt-[2rem] flex flex-col relative w-full overflow-x-hidden bg-white rounded-3xl p-3">
        <div className="mt-4 flex flex-col relative">
            <span>Smartcard Number</span>
            <div className={`relative w-full flex items-center border-b-[3px] ${cableTvInputFocus && !smartCardErrorText ? 'border-b-main-color' : smartCardErrorText ? 'border-b-red-600' : 'border-b-black'} `}>
                <input 
                    placeholder="Enter Smartcard Number" 
                    onChange={handleSmartCardInput}  
                    value={smartCardNumber}
                    className="w-full border-none outline-none focus:border-none" 
                    onFocus={() => setCableTvInputFocus(true)}
                    onBlur={() => setCableTvInputFocus(false)}
                />
                {
                    cableTvInputFocus && smartCardNumber !== '' ? (
                            <IoMdCloseCircle onClick={removeSmartCard} className="size-[30px] z-30 cursor-pointer text-gray-400" />
                        ) : (
                            <FaRegAddressCard onClick={() => setPrevCableTvCards((prev) => !prev)} className="text-main-color z-30 bg-light-bg p-[2px] text-[25px] rounded-[3px] font-bold" />
                        )
                }
            </div>
            <div>
              <p>
                {
                  fetchingUserDetails ? 
                    <div className="flex items-center gap-1 text-main-color mt-3 phone:text-[14px]">
                      <div className='mt-0 mb-0'>
                        <div class="loading-spinner-small h-5 w-5 border-3 mt-[0px] mb-[0px]"></div>
                      </div>
                        Checking...
                    </div> : 
                  verifiedCableTvUserName ? 
                    <p className="text-black font-semibold mt-1 phone:text-[15px]">Smartcard Name: {verifiedCableTvUserName.trim()}</p> :
                    ''
                }
              </p>
            </div>
            {
                smartCardErrorText && (
                  <p className="text-red-600 text-[15px] font-semibold">{smartCardErrorText}</p>
                )
            }
            {
                  prevCableTvCards && bravesubusercabletvsmartcards.length > 0 && (
                    <div className="p-3 z-40 rounded-2xl bg-white shadow-2xl absolute right-8 top-6 small-phone:top-[-24px]">
                      {
                        bravesubusercabletvsmartcards?.map((item) => (
                          <div key={item?.smartCard} className=" flex items-center justify-between border-b-[3px] pb-2 pt-2">
                            <p className="font-bold text-gray-700 mr-[5rem] phone:mr-[2.5rem] w-full small-phone:text-[14px]" onClick={() => setQuickMeterNumber(item?.smartCard)} >{item.smartCard}</p>
                            <span className="text-gray-600 text-[15px] mr-[1rem] phone:text-[13px] small-phone:text-[11px]">{item.lastBought}</span>
                            <span className=""
                              onClick={() => removeCableTvSmartCardFromStorage(item.smartCard)}
                            >
                              <IoMdCloseCircle className="text-gray-600 cursor-pointer text-[18px] phone:text-[16px]" />
                            </span>
                          </div>
                        ))
                      }
                    </div>
                  )
                }
        </div>

        <div className="w-full flex items-center justify-between mt-4">
            <p className="text-[14px] phone:text-[12px]">Save to histroy list</p>
            <div onClick={() => addToList(isAddToList)} className={`bg-gray-400 pl-[4px] pr-[4px] pt-[5px] pb-[5px] small-phone:pt-[3px] small-phone:pb-[3px] w-[45px] small-phone:w-[40px] h-[26px] small-phone:h-[20px] flex items-center rounded-xl cursor-pointer relative ${isAddToList ? 'bg-green-500': '' }`}>
                <div className={`h-[20px] w-[20px] small-phone:h-[15px] small-phone:w-[15px] bg-white  rounded-full  ${isAddToList ? 'absolute right-1' : ''}`}></div>
            </div>
        </div>
      </div>


      {/**Display availble selected cable tv options */}
      <div className="mt-[3rem] flex flex-col relative w-full overflow-x-hidden bg-white rounded-3xl p-3">
        <div className="flex items-center gap-1 border-b-[2px] border-b-gray-300 p-2">
          <img src={cableTvIcon} alt='' className="w-[15px]" />
          <p className="phone:text-[15px]">{cableTvName}</p>
        </div>

        <div className="w-full phone:h-[20rem] overflow-y-auto mt-5">
            <button onClick={handleProceedToPay}>Pay</button>
        </div>
      </div>

      <div className='mt-[2rem] mb-[5rem]'></div>

    </div>
  )
}

export default Tv