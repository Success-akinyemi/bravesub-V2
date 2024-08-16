import { useEffect, useState } from "react";
import { FaArrowLeftLong } from "react-icons/fa6";
import { Link } from "react-router-dom";
import Announcement from "../Components/Announcement";
import { FaListUl } from "react-icons/fa";
import { IoMdCloseCircle } from "react-icons/io";
import { quickPrices } from "../data/electricity";
import { FaNairaSign } from "react-icons/fa6";
import { useSelector } from "react-redux";
import LogoImg from '../assets/logo.png'
import { IoIosArrowDown } from "react-icons/io";
import { verifyElectricMeterNumber } from "../Helpers/api";

function Electricity({formData, setformData, setSelectedCard, providerIcon, providerName, meterType}) {
    const { currentUser } = useSelector((state) => state.braveSubUser);
    const user = currentUser?.data

    const [ isAnnouncement, setIsAnnouncement ] = useState(true)
    const [ providerNameError, setProviderNameError ] = useState(null)
    const [ meterTypeError, setMeterTypeError ] = useState(null)

    const [ meterIdErrorText, setMeterIdErrorText ] = useState(null)
    const [ meterId, setMeterId ] = useState()
    const [ meterIdFocused, setMeterIdFocused ] = useState(false)
    const [ prevMeterIds, setPrevMeterIds ] = useState(false)

    const [ amountErrorText, setAmountErrorText ] = useState(null)
    const [ meterAmountFocused, setMeterAmountFocused ] = useState(false)
    const [ amount, setAmount ] = useState()
    const [ isAddToList, setIsAddToList ] = useState(true)

    const [ verifiedMeterName, setVerifiedMeterName ] = useState()
    const [ fetchingUserDetails, setFetchingUserDetails ] = useState(false)

    const quickAmounts = quickPrices

    //previous meter numbers
    const bravesubusermeternumber = JSON.parse(localStorage.getItem('bravesubelectricmeternumber')) || [];


    useEffect(() => {
        if(formData.providerName){
          setProviderNameError(null)
        }
        if(formData.meterType){
          setMeterTypeError(null)
        }

        const fetchData = async () => {
          if (formData?.meterSlug && formData?.meterNumber?.length > 10) {
            
            try {
              setFetchingUserDetails(true)
              const electricCompany = formData?.meterSlug
              const userMeterNumber = formData?.meterNumber
              const res = await verifyElectricMeterNumber({ electricCompany, userMeterNumber });
              if(res.success){
                setVerifiedMeterName(res?.data);
              } else{
                setVerifiedMeterName(res?.data);
              }
            } catch (error) {

            } finally {
              setFetchingUserDetails(false);
            }
          }
        };
    

        fetchData();                
      }, [formData])
      
    const handleMeterNumberInput = (e) => {
        setMeterIdErrorText(null)
        setMeterId(e.target.value)
        setformData({ ...formData, meterNumber: e.target.value})
    }

    const handleMeterAmount = (e) => {
      setAmountErrorText(null)
      setAmount(e.target.value)
      setformData({ ...formData, amount: e.target.value})
    }

    const setAmountValue = (item) => {
      setAmountErrorText(null)
      setAmount(item?.amount)
      setformData({ ...formData, amount: item?.amount})
    }

    const removeAmount = () => {
      setAmount('')
      setformData({ ...formData, amount: ''})
    }

    const removeMeterId = () => {
      setMeterId('')
      setformData({...formData, meterNumber: ''})
    }

    const handleServices = () => {
        setSelectedCard('electricServiceProviders')
    }

    const addToList = (prev) => {
        setIsAddToList((prev) => !prev)
        setformData({ ...formData, addMeterIdToList: !prev })
    }

    const handleMeterType = () => {
        setSelectedCard('electricMeterType')
    }

    const setQuickMeterNumber = (number) => {
      setMeterIdErrorText(null)
      setMeterId()
      setformData({...formData, meterNumber: ''})
      setMeterId(number)
      setformData({...formData, meterNumber: number})
      setPrevMeterIds(false)
    }

    const removeMeterNumberFromStorage = (number) => {
      const updatedNumbers = bravesubusermeternumber.filter(item => item.meterNumber !== number);
      localStorage.setItem('bravesubelectricmeternumber', JSON.stringify(updatedNumbers));
    };

    const handlePay = () => {
      if(!formData.providerName){
        setProviderNameError('Select a service provider name')
        return;
      }
      if(!formData.meterType){
        setMeterTypeError('select a meter type')
        return;
      }
      const regex = /^[0-9]+$/;

      if(!formData.meterNumber){
        setMeterIdErrorText('Enter Meter number')
        return;
      }
      if(!regex.test(formData.meterNumber) || formData?.meterNumber?.length < 10 || formData?.meterNumber?.length > 13){
        setMeterIdErrorText('Enter a valid meter number')
        return;
      }
      if(!formData.amount){
        setAmountErrorText('Enter amount')
        return;
      }
      if(!regex.test(formData.amount)){
        setAmountErrorText('Enter a valid amount number')
        return;
      }

      setformData({...formData, addMeterIdToList: isAddToList, verifiedMeterName: verifiedMeterName })
      setSelectedCard('payElectricBilsModal')

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
      <div className={`${isAnnouncement ? 'mt-[15px]' : 'mt-[65px]' } flex flex-col relative w-full overflow-x-hidden bg-white rounded-3xl p-3`}>
        <div className={`flex items-center justify-between cursor-pointer p-2 border-b-[1px] ${providerNameError ? 'border-b-[2px] border-b-red-600' : 'border-b-gray-400'} `} onClick={handleServices}>
            <div className="flex items-center gap-[4px]">
                <img src={providerIcon} alt='' className="w-[15px]" />
                <h2 className="font-semibold">{providerName}</h2>
            </div>
            
            <div>
              <IoIosArrowDown />
            </div>
        </div>
        {
                providerNameError && (
                  <p className="text-red-600 text-[15px] font-semibold">{providerNameError}</p>
                )
              }
        <div className="w-full p-2">
            <p className="text-[12px] phone:text-[11px] text-gray-500">Ensure you have validated your KYC online to be able to recharge your meter</p>
        </div>
      </div>

      {/**Payment item */}
      <div className="mt-[2rem] flex flex-col relative w-full overflow-x-hidden bg-white rounded-3xl p-3">
        <p>Payment Items</p>
        <div  onClick={handleMeterType} className={`flex items-center justify-between p-2 border-b-[1px] ${meterTypeError ? 'border-b-[2px] border-b-red-600' : 'border-b-gray-400'}`}>
            <p className="text-[24px] font-semibold">{meterType}</p>
            <div>
              <IoIosArrowDown />
            </div>
        </div>
        {
                meterTypeError && (
                  <p className="text-red-600 text-[15px] font-semibold">{meterTypeError}</p>
                )
              }

        <div className="mt-4 flex flex-col relative">
            <span>Meter Number</span>
            <div className={`relative w-full flex items-center border-b-[3px] ${meterIdFocused && !meterIdErrorText ? 'border-b-main-color' : meterIdErrorText ? 'border-b-red-600' : 'border-b-black'} `}>
                <input 
                    placeholder="Enter Meter Number" 
                    onChange={handleMeterNumberInput}  
                    value={meterId}
                    className="w-full border-none outline-none focus:border-none" 
                    onFocus={() => setMeterIdFocused(true)}
                    onBlur={() => setMeterIdFocused(false)}
                />
                {
                    meterIdFocused && meterId !== '' ? (
                            <IoMdCloseCircle onClick={removeMeterId} className="size-[30px] z-30 cursor-pointer text-gray-400" />
                        ) : (
                            <FaListUl onClick={() => setPrevMeterIds((prev) => !prev)} className="text-main-color z-30 bg-light-bg p-[2px] text-[25px] rounded-[3px] font-bold" />
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
                  verifiedMeterName ? 
                    <p className="text-black font-semibold mt-1">METER NAME: {verifiedMeterName.trim()}</p> :
                    ''
                }
              </p>
            </div>
            {
                meterIdErrorText && (
                  <p className="text-red-600 text-[15px] font-semibold">{meterIdErrorText}</p>
                )
            }
            {
                  prevMeterIds && bravesubusermeternumber.length > 0 && (
                    <div className="p-3 z-40 rounded-2xl bg-white shadow-2xl absolute right-8 top-6 small-phone:top-[-24px]">
                      {
                        bravesubusermeternumber?.map((item) => (
                          <div key={item?.meterNumber} className=" flex items-center justify-between border-b-[3px] pb-2 pt-2">
                            <p className="font-bold text-gray-700 mr-[5rem] phone:mr-[2.5rem] w-full small-phone:text-[14px]" onClick={() => setQuickMeterNumber(item?.meterNumber)} >{item.meterNumber}</p>
                            <span className="text-gray-600 text-[15px] mr-[1rem] phone:text-[13px] small-phone:text-[11px]">{item.lastBought}</span>
                            <span className=""
                              onClick={() => removeMeterNumberFromStorage(item.meterNumber)}
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

      {/**Amount */}
      <div className='mt-[2rem] flex flex-col relative w-full overflow-x-hidden bg-white rounded-3xl p-3'>
          <p className="phone:text-[14px] small-phone:text-[13px]">Select Amount</p>
          <div className="grid grid-cols-3 items-center justify-center mt-2 gap-4 phone:gap-2 text-black">
              {
                quickAmounts.map((item) => (
                  <div key={item._id} onClick={() => setAmountValue(item)} className="flex flex-col items-center justify-center cursor-pointer bg-gray-200 rounded-lg flex-wrap flex-1 p-3">
                      <span className="flex items-baseline">
                        <FaNairaSign className="text-[16px] phone:text-[14px] small-phone:text-[13px]" />
                        <h3 className="text-[30px] phone:text-[28px] small-phone:text-[25px]">{item?.amount}</h3>
                      </span>
                      <p className="flex items-center text-[15px] phone:text-[13px] text-main-color">
                        {
                            item?.cashback ? (
                              <>
                                <FaNairaSign /> {item?.cashback}                           
                              </>
                            ) : (
                              ''
                            )
                        }
                      </p>
                  </div>
                ))
              }
          </div>
          <div className="w-full mt-3 flex flex-col">
              <div className={`flex p-3 items-center border-b-[2px] ${meterAmountFocused && !amountErrorText ? 'border-b-main-color' : amountErrorText ? 'border-b-red-600' : 'border-b-gray-400'} gap-1`}>
                <FaNairaSign className="text-black text-[28px]" />
                <input 
                  type="text" 
                  className="w-full text-[30px] font-semibold text-black border-none outline-none focus:border-none" 
                  value={amount}
                  onChange={handleMeterAmount}
                  onFocus={() => setMeterAmountFocused(true)}
                  onBlur={() => setMeterAmountFocused(false)}
                />
                <IoMdCloseCircle onClick={removeAmount} className="size-[36px] cursor-pointer text-gray-400" />
                <div onClick={handlePay}>
                  <button className="btn">pay</button>
                </div>
              </div>
              {
                amountErrorText && (
                  <p className="text-red-600 text-[15px] font-semibold">{amountErrorText}</p>
                )
              }
              <div className="text-[14px] mt-4 flex items-center gap-1">
                <img src={LogoImg} className="w-[30px] phone:w-[25px] small-phone:w-[20px]" />
                <span className="text-main-color font-semibold">{user?.cashPoint} BravePoints</span>
                <span>Availble</span>
              </div>
          </div>
      </div>

    </div>
  );
}

export default Electricity;
