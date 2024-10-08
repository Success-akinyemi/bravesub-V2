import { useState } from "react";
import { IoClose } from "react-icons/io5";
import LoadingBtn from "../Helpers/LoadingBtn";
import LoadingOvelay from "../Helpers/LoadingOvelay";
import { buyElectricityBills } from "../../Helpers/api";

function PayElectricBilsModal({ setformData, formData, setSelectedCard }) {
  const [isLoading, setIsLoading] = useState(false);


  const handleClose = () => {
    setSelectedCard(null);
  };

  const buyElectricity = async () => {
    const meterNumber = formData?.meterNumber;
    //update the mobile numbers

    const now = new Date();
    const lastBought = now.toTimeString().split(" ")[0].slice(0, 5);
    let meterNumberArray =
      JSON.parse(localStorage.getItem("bravesubelectricmeternumber")) || [];

    const existingEntryIndex = meterNumberArray.findIndex(
      (entry) => entry.meterNumber === meterNumber
    );
    if (existingEntryIndex !== -1) {
      // Update the existing entry with the new time
      meterNumberArray[existingEntryIndex].lastBought = lastBought;
    } else {
      // Add a new entry to the array
      meterNumberArray.push({ meterNumber, lastBought });
    }

    //save new number or update phone number
    localStorage.setItem(
      "bravesubelectricmeternumber",
      JSON.stringify(meterNumberArray)
    );
    try {
      setIsLoading(true);
      const res = await buyElectricityBills(formData);
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
            <p className="text-gray-800">{formData?.providerName}</p>
          </div>
          <div className="flex items-center justify-between w-full p-3 border-b-[1px] border-b-gray-300">
            <p className="font-medium text-black">Meter Number</p>
            <p className="text-gray-800">{formData?.meterNumber}</p>
          </div>
          <div className="flex items-center justify-between w-full p-3 border-b-[1px] border-b-gray-300">
            <p className="font-medium text-black">Meter Name</p>
            <p className="text-gray-800">{formData?.meterName}</p>
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
              <div className="flex flex-1 w-full" onClick={buyElectricity}>
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
  );
}

export default PayElectricBilsModal;
