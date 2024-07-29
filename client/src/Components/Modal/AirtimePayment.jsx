import { FaNairaSign } from "react-icons/fa6";
import { AiOutlineExclamationCircle } from "react-icons/ai";
import { useState } from "react";
import { useSelector } from "react-redux";
import { buyAirtime } from "../../Helpers/api";
import LoadingOvelay from "../Helpers/LoadingOvelay";
import LoadingBtn from "../Helpers/LoadingBtn";

function AirtimePayment({formData, setFormData}) {
  const { currentUser } = useSelector((state) => state.braveSubUser);
  const user = currentUser?.data
  const [showTooltip, setShowTooltip] = useState(false);
  const [ isLoading, setIsLoading ] = useState(false)
  const cashPoint = user.cashPoint
  const discount = import.meta.env.VITE_APP_AIRTIME_DISCOUNT
  const useCashback = () => {
    if(formData?.useCashback === false){
      setFormData({...formData, useCashback: true})
    } else {
      setFormData({...formData, useCashback: false})
    }
  }

  const handleAirtime = async (e) => {
    e.preventDefault()
    try {
      const phoneNumber = formData.phoneNumber
      //update the mobile numbers
      
      const now = new Date();
      const lastBought = now.toTimeString().split(' ')[0].slice(0, 5)
      let phoneNumbersArray = JSON.parse(localStorage.getItem('bravesubuserphonenumber')) || [];
      
      const existingEntryIndex = phoneNumbersArray.findIndex(entry => entry.phoneNumber === phoneNumber);
      if (existingEntryIndex !== -1) {
        // Update the existing entry with the new time
        phoneNumbersArray[existingEntryIndex].lastBought = lastBought;
      } else {
        // Add a new entry to the array
        phoneNumbersArray.push({ phoneNumber, lastBought });
      }

      //save new number or update phone number
      localStorage.setItem('bravesubuserphonenumber', JSON.stringify(phoneNumbersArray));
      setIsLoading(true)
      const res = await buyAirtime(formData)
    } catch (error) {
      
    } finally{
      setIsLoading(false)
    }
  }

  return (
    <form onSubmit={handleAirtime} className="absolute left-0 top-0 flex w-full h-[100%] flex-col items-center">
      <h1 className="text-[20px] font-bold small-phone:text-[16px]">Payment</h1>
      <h1 className="flex items-center gap-1 text-[36px] small-phone:text-[26px] font-semibold text-main-color" ><FaNairaSign />{ formData.useCashback ? Math.round(formData?.airtimeValue - cashPoint).toFixed(2) : Math.round(formData?.airtimeValue).toFixed(2) }</h1>
      {
        formData.useCashback && (
          <h3 className="font-semibold text-gray-400 line-through text-[24px] flex items-center gap-1 mb-2 phone:text-[20px] small-phone:text-[17px]"><FaNairaSign /> {Math.round(formData?.airtimeValue).toFixed(2)}</h3>
        )
      }

      <div className="w-full overflow-y-auto">
          <div className="w-full bg-white p-4 rounded-2xl flex flex-col gap-3">
            <div className="flex items-center justify-between">
              <p className="text-[20px] font-light phone:text-[17px] small-phone:text-[14px]">Amount</p>
              <p className="flex items-center text-[20px] phone:text-[17px] font-medium small-phone:text-[14px]"><FaNairaSign className="text-[16px] small-phone:text-[13px]" />{formData?.airtimeValue}</p>
            </div>
            <div className="flex items-center justify-between">
              <p className="text-[20px] font-light phone:text-[17px] small-phone:text-[14px]">Provider</p>
              <p className="font-medium text-[22px] phone:text-[17px] flex gap-1.5 items-center small-phone:text-[14px]">
                <img className="w-[20px]" alt={formData?.network} src={formData?.icon} />
                {formData?.network}
              </p>
            </div>
            <div className="flex items-center justify-between">
              <p className="text-[20px] font-light phone:text-[17px] small-phone:text-[14px]">Mobile Number</p>
              <p className="font-medium text-[20px] phone:text-[17px] small-phone:text-[14px]">{formData?.phoneNumber}</p>
            </div>
          </div>

          <div className="w-full mt-8 bg-white p-3 rounded-2xl flex items-center justify-between">
            <p className="small-phone:text-[14px]">BravePoints</p>
            <div className="flex items-center gap-3">
              <p className={`flex items-center text-[17px] font-medium small-phone:text-[13px] ${formData.useCashback ? 'line-through text-gray-400' : ''}`}><FaNairaSign /> {Math.round(cashPoint).toFixed(2)} availble</p>
              <div onClick={useCashback} className={`bg-gray-400 pl-[4px] pr-[4px] pt-[5px] pb-[5px] small-phone:pt-[3px] small-phone:pb-[3px] w-[45px] small-phone:w-[40px] h-[26px] small-phone:h-[20px] flex items-center rounded-xl cursor-pointer relative ${formData.useCashback ? 'bg-green-500': '' }`}>
                <div className={`h-[20px] w-[20px] small-phone:h-[15px] small-phone:w-[15px] bg-white  rounded-full  ${formData.useCashback ? 'absolute right-1' : ''}`}></div>
              </div>
            </div>
          </div>

          <div className="flex flex-col mt-8">
            <p className="small-phone:text-[14px] font-semibold">Earn</p>
            <div className="flex items-center justify-between rounded-2xl p-3 w-full bg-white small-phone:mb-8">
            <div className="flex items-center gap-2 small-phone:gap-1">
                <p className="small-phone:text-[14px]">BravePoints</p>
                <div className="relative">
                    <a
                    href="#"
                    onMouseEnter={() => setShowTooltip(true)}
                    onMouseLeave={() => setShowTooltip(false)}
                    className="flex items-center"
                    >
                        <AiOutlineExclamationCircle className="text-[20px] small-phone:text-[16px]" />
                    </a>
                    {showTooltip && (
                        <div className="absolute z-20 left-full ml-2 w-48 p-2 bg-gray-800 text-white text-xs rounded shadow-lg">
                            BravePoints are calculated based on total amount paid. Get cash backs on purchases.
                        </div>
                    )}
                </div>
            </div>
              <p className="text-yellow-500 font-bold text-[17px] small-phone:text-[14px]">+{Math.round((discount*formData.airtimeValue)/100)}Pts</p>
            </div>
          </div>

      </div>

      <div className="w-full mt-auto flex items-center justify-center">
        {
          isLoading ? (
            <LoadingBtn />
          ) : (
            <button type="submit" className="btn">Proceed to Pay</button>
          )
        }
      </div>
      {
        isLoading && (
          <LoadingOvelay />
        )
      }
    </form>
  )
}

export default AirtimePayment