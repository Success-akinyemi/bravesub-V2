import { FaArrowLeftLong, FaNairaSign } from "react-icons/fa6"
import { Link } from "react-router-dom"
import { dataNetworks } from "../data/data"
import { useEffect, useState } from "react"
import LogoImg from '../assets/logo.png'
import { IoMdArrowDropdown } from "react-icons/io"
import { useAdminFetAllDataPlans } from "../Helpers/fetch.hooks"
import FootNav from "./Components/FootNav"

function DataPlans({ setSelectedCard, setformData, formData}) {
    const networks = dataNetworks
    const[ logo, setLogo] = useState(LogoImg)
    const [ isOpen, setIsOpen ] = useState(false)
    const { dataPlans, isFetchingDataPlans } = useAdminFetAllDataPlans()
    const dataOptions = dataPlans?.data
    const [dataArrayToDisplay, setDataArrayToDisplay] = useState([]);

    useEffect(() => {
        const updateDataArray = () => {
          const filteredData = dataOptions?.filter(option => option?.networkCode === formData?.networkCode);
          setDataArrayToDisplay(filteredData);
        };
    
        if (formData?.networkCode) {
          updateDataArray();
        } else {
            setDataArrayToDisplay(dataOptions)
        }


      }, [formData, dataOptions]);

    const toggleNetworkSelect = () => {
        setIsOpen((prev) => !prev)
    }

    const selectNetwork = (item) => {
        setLogo(item?.icon)
        setformData({ icon: item?.icon, networkCode: item?.code, network: item?.network})
        setIsOpen(false)
    }

    const setData = ({item, newPlan}) => {
        setformData(item)
        //setformData({...formData, newPlan: newPlan})
        setSelectedCard('editDataPlans')
    }

    const handleNewData = () => {
        setformData({})
        setSelectedCard('editDataPlans')
    }

  return (
    <div className="page pt-0">
        <div className="pagination w-full bg-white h-[50px] fixed left-0 right-0 flex items-center justify-between z-30">
            <div className="flex items-center gap-3 small-phone:gap-[10px]">
                <Link className="" to={'/admin-dashboard'}>
                    <FaArrowLeftLong className="text-[25px] small-phone:text-[20px]" />
                </Link>
                <h2 className="text-[20px] phone:[17px] small-phone:text-[15px] font-semibold">
                    Data Plans
                </h2>
            </div>

        </div>

        {/**NETWORK SELECT*/}
        <div className="mt-[50px] flex items-center">
            <h2 className="font-bold mr-4 small-phone:text-[15px]">Select a Network</h2>
            <button className="flex items-center gap-1" onClick={toggleNetworkSelect}>
                <img src={logo} alt="logo" className="w-[45px] small-phone:w-[40px]" />
                <IoMdArrowDropdown className="text-[40px]" />
            </button>
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
        </div>

        {/**ALL DATA */}
        <div className="mt-8 flex">
            <button className="text-[15px] small-phone:text-[13px] p-[6px] bg-main-color text-white rounded-xl outline-none border-0 cursor-pointer" onClick={handleNewData}>New Data Plan</button>
        </div>
        <h3 className="text-gray-700 font-bold  small-phone:text-[15px]">Data Plans</h3>
        <small className="text-[13px] text-gray-900">*click on any data plans to edit.</small>
        <div className="w-full flex flex-col bg-white p-3 rounded-3xl mt-2 phone:mb-[10rem]">
            <div className="flex gap-3 flex-wrap mt-3 justify-center">
                {
                isFetchingDataPlans ? (
                    <div className='flex w-full items-center justify-center '>
                    <div class="mt-[4rem] mb-[4rem] loading-spinner"></div>
                    </div>
                ) : (
                        dataArrayToDisplay?.map((item, idx) => (
                            <div onClick={() => setData({item, newPlan: false})} key={item?._id} className='flex flex-col items-center p-2 border border-gray-500 rounded-2xl gap-2 cursor-pointer'>
                                <p className='text-main-color text-[19px] phone:text-[17px] small-phone:text-[15px]'>{item.validity}</p>
                                <div className='flex items-baseline'>
                                    <h2 className='text-[32px] phone:text-[24px] small-phone:text-[22px] font-semibold'>{item.planName}</h2>
                                    <p className='font-semibold phone:text-[15px] small-phone:text-[14px]'>{item.planType}</p>
                                </div>
                                <span className='flex items-center gap-1 small-phone:text-[15px] small-phone:gap-[1px] font-medium'>
                                    <FaNairaSign />
                                    {item?.price}
                                </span>
                                <span className='flex items-center text-gray-600 small-phone:text-[13px]'>
                                    <FaNairaSign className='font-extralight' />
                                    {`${item?.cashBack} cashback`}
                                </span>
                            </div>
                        )) 
                )
                }
            </div>
        </div>
        <FootNav />
    </div>
  )
}

export default DataPlans