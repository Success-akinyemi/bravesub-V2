import { accountType } from "../../data/electricity"

function ElectricMeterType({setFormData, formData, setSelectedCard, setMeterType}) {
    const isFetchingElectricMeter = false

    const electricityAccount = accountType
    const handleMeterType = (item) => {
        setMeterType(item?.type)
        setFormData({ ...formData, meterType: item?.type })
        setSelectedCard(null)
    }
  return (
    <div className="flex flex-col items-center gap-6 w-full absolute left-0 top-0 h-full bg-white">
        <div className="p-2 flex w-full items-center justify-center border-b-2 border-b-gray-400">
            <p className="text-[22px] small-phone:text-[19px] text-gray-900">Select Meter Type</p>
        </div>

        <div className="flex items-center w-full flex-col">
            {
                isFetchingElectricMeter ? (
                    <div className='flex w-full items-center justify-center '>
                        <div class="mt-[4rem] mb-[4rem] loading-spinner"></div>
                    </div>
                ) : (
                        electricityAccount?.map((item) => (
                            <div onClick={() => handleMeterType(item)} key={item?._id} className="flex items-center gap-4 w-full border-b-2 border-b-gray-300 p-4 cursor-pointer">
                                <p className="text-[22px] small-phone:text-[19px] phone:text-[20px]">{item?.type}</p>
                            </div>
                        ))
                )
            }
        </div>
    </div>
  )
}

export default ElectricMeterType