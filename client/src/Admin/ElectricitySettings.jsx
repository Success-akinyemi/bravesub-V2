import { FaArrowLeftLong } from 'react-icons/fa6'
import { useFetchElectricityServiceProviders } from '../Helpers/fetch.hooks';

function ElectricitySettings({ setSelectedCard, setformData, formData}) {
    const { currentUser } = useSelector((state) => state.braveSubUser);
    const user = currentUser?.data
    const { electricServiceProviders, isFetchingElectricServices } = useFetchElectricityServiceProviders(user?._id)
    const providersData = electricServiceProviders?.data

    const setElectricServiceProvider = ({item}) => {
        setformData(item)
        //setformData({...formData, newPlan: newPlan})
        setSelectedCard('')
    }

    const handleNewServices = () => {
        setformData({})
        setSelectedCard('')
    }

  return (
    <div className='page pt-0'>
        {/**NAVBAR */}
        <div className="pagination w-full bg-white h-[50px] fixed left-0 right-0 flex items-center justify-between z-30">
            <div className="flex items-center gap-3 small-phone:gap-[10px]">
                <Link className="" to={'/admin-dashboard'}>
                    <FaArrowLeftLong className="text-[25px] small-phone:text-[20px]" />
                </Link>
                <h2 className="text-[20px] phone:[17px] small-phone:text-[15px] font-semibold">
                    Electricty Setup
                </h2>
            </div>

        </div>

        {/**SERVICES PROVIDERS */}
        <div className="mt-8 flex">
            <button className="text-[15px] small-phone:text-[13px] p-[6px] bg-main-color text-white rounded-xl outline-none border-0 cursor-pointer" onClick={handleNewServices}>New Service Provider</button>
        </div>
        <h3 className="text-gray-700 font-bold  small-phone:text-[15px]">Electrictiy service providers</h3>
        <small className="text-[13px] text-gray-900">*click on any to edit.</small>
        <div className="w-full flex flex-col bg-white p-3 rounded-3xl mt-2 phone:mb-[10rem]">
            <div className="flex gap-3 flex-wrap mt-3 justify-center">
                {
                isFetchingElectricServices ? (
                    <div className='flex w-full items-center justify-center '>
                    <div class="mt-[4rem] mb-[4rem] loading-spinner"></div>
                    </div>
                ) : (
                    providersData?.map((item, idx) => (
                            <div onClick={() => setElectricServiceProvider({item, newPlan: false})} key={item?._id} className=''>

                            </div>
                        )) 
                )
                }
            </div>
        </div>

    </div>
  )
}

export default ElectricitySettings