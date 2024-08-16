import { useState } from "react";
import LoadingBtn from "../Helpers/LoadingBtn";
import LoadingOvelay from "../Helpers/LoadingOvelay";
import { IoClose } from "react-icons/io5";
import { buyCableTv } from "../../Helpers/api";

function PayCableTv({setformData, formData, setSelectedCard}) {
  const [isLoading, setIsLoading] = useState(false);

    console.log("form", formData);

    const handleClose = () => {
        setSelectedCard(null);
    };

    const PayCableTvBills = async () => {
        const smartCard = formData?.smartCardNumber;
    
        const now = new Date();
        const lastBought = now.toTimeString().split(" ")[0].slice(0, 5);
        let smartCardArray =
          JSON.parse(localStorage.getItem("bravesubusercabletvsmartcards")) || [];
    
        const existingEntryIndex = smartCardArray.findIndex(
          (entry) => entry.smartCard === smartCard
        );
        if (existingEntryIndex !== -1) {
          // Update the existing entry with the new time
          smartCardArray[existingEntryIndex].lastBought = lastBought;
        } else {
          // Add a new entry to the array
          smartCardArray.push({ smartCard, lastBought });
        }
    
        //save new number or update phone number
        localStorage.setItem(
          "bravesubusercabletvsmartcards",
          JSON.stringify(smartCardArray)
        );
        try {
          setIsLoading(true);
          const res = await buyCableTv(formData);
        } catch (error) {
        } finally {
          setIsLoading(false);
        }
      };

  return (
    <div className="fixed w-[100vw] h-[100vh] top-0 left-0 bg-black bg-opacity-80 z-50 overflow-x-hidden flex items-center justify-center">
      <div className="flex items-center bg-white rounded-3xl flex-col relative p-3 w-[50vw] phone:w-[90vw]">
        <div onClick={handleClose} className="ml-auto">
          <IoClose className="text-[32px]" />
        </div>

        <div className="flex items-center w-full flex-col mt-4">
          <div className="flex items-center justify-between w-full p-3 border-b-[1px] border-b-gray-300">
            <p className="font-medium text-black">Service Provider</p>
            <p className="text-gray-800">{formData?.cableTvName}</p>
          </div>
          <div className="flex items-center justify-between w-full p-3 border-b-[1px] border-b-gray-300">
            <p className="font-medium text-black">Smart Card Number</p>
            <p className="text-gray-800">{formData?.smartCardNumber}</p>
          </div>
          <div className="flex items-center justify-between w-full p-3 border-b-[1px] border-b-gray-300">
            <p className="font-medium text-black">Smartcard Name</p>
            <p className="text-gray-800">{formData?.smartcardName}</p>
          </div>
          <div className="flex items-center justify-between w-full p-3 border-b-[1px] border-b-gray-300">
            <p className="font-medium text-black">Amount</p>
            <p className="text-gray-800">{formData?.amount}</p>
          </div>
        </div>

        <div className="flex items-center gap-4 w-full mt-4">
          {isLoading ? (
            <LoadingBtn />
          ) : (
            <>
              <div className="flex flex-1 w-full" onClick={handleClose}>
                <button className="btn bg-gray-600">Cancel</button>
              </div>
              <div className="flex flex-1 w-full" onClick={PayCableTvBills}>
                {isLoading ? (
                  <LoadingBtn />
                ) : (
                  <button disabled={isLoading} className="btn">
                    Confirm
                  </button>
                )}
              </div>
            </>
          )}
        </div>
        {isLoading && <LoadingOvelay />}
      </div>
    </div>
  )
}

export default PayCableTv