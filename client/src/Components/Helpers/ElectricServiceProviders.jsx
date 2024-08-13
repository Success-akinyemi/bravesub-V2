import { electricityProviders } from "../../data/electricity"

function ElectricServiceProviders({setFormData, formData, setSelectedCard, setProviderName, setProviderIcon}) {
    const isFetchingElectricServices = false
    
    const electricityServices = electricityProviders

    const handleServices = (item) => {
        setProviderName(item?.name)
        setProviderIcon(item?.icon)
        setFormData({ ...formData, providerName: item?.name, })
        setSelectedCard(null)
    }
    return (
    <div className="flex flex-col items-center gap-8 bg-white mt-1 absolute top-0 left-0 w-full h-full rounded-md">
        <div className="flex items-center justify-center p-2 border-b-2 border-b-gray-400 w-full">
            <p className="text-[22px] small-phone:text-[19px] text-gray-900">Select Service Providers</p>
        </div>

        <div className="flex flex-col w-full h-full overflow-y-auto">
            {
                isFetchingElectricServices ? (
                    <div className='flex w-full items-center justify-center '>
                        <div class="mt-[4rem] mb-[4rem] loading-spinner"></div>
                    </div>
                ) : (
                    electricityServices?.map((item) => (
                        <div onClick={() => handleServices(item)} key={item?._id} className="flex items-center gap-4 w-full border-b-2 border-b-gray-300 p-4 cursor-pointer">
                            <img src={item?.icon} alt="" className="w-[20px]" />
                            <p className='text-[22px] small-phone:text-[19px] phone:text-[20px]'>{item?.name}</p>
                        </div>
                    ))
                )
            }
        </div>
    </div>
  )
}

export default ElectricServiceProviders