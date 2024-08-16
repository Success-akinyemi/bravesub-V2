import { cableTvs } from "../../data/cableTv"

function TvServiceProviders({setFormData, formData, setSelectedCard, setCableTvName, setCableTvIcon}) {
  const isFetchingCableTvs = false

  const tvProviders = cableTvs

  const handleServices = (item) => {
    setCableTvName(item?.name)
    setCableTvIcon(item?.icon)
    setFormData({ ...formData, cableTvName: item?.name, cableTvCode: item?.code, cableTvSlug: item?.slug, _id: item?._id })
    setSelectedCard(null)
  }
  
  return (
    <div className="flex flex-col items-center gap-8 bg-white mt-1 absolute top-0 left-0 w-full h-full rounded-md">
        <div className="flex items-center justify-center p-2 border-b-2 border-b-gray-400 w-full">
            <p className="text-[22px] small-phone:text-[19px] text-gray-900">Select Biller</p>
        </div>

        <div className="flex flex-col w-full h-full overflow-y-auto">
            {
                isFetchingCableTvs ? (
                    <div className='flex w-full items-center justify-center '>
                        <div class="mt-[4rem] mb-[4rem] loading-spinner"></div>
                    </div>
                ) : (
                    tvProviders?.map((item) => (
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

export default TvServiceProviders