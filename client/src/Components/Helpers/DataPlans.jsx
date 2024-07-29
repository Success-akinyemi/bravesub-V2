import { useEffect, useState } from 'react';
import LogoImg from '../../assets/logo.png'
import { dataOptions } from '../../data/data'
import { FaNairaSign } from "react-icons/fa6";
import { useSelector } from 'react-redux';
import { useFetchDataPlans } from '../../Helpers/fetch.hooks';

function DataPlans({formData, setformData, setSelectedCard, setPhoneNumberError}) {
  const { currentUser } = useSelector((state) => state.braveSubUser);
  const user = currentUser?.data
    const cashPoint = user.cashPoint
    const { dataPlans, isFetchingDataPlans } = useFetchDataPlans()
    //const dataOptions = dataOptions
    const dataOptions = dataPlans?.data
  
    const [dataArrayToDisplay, setDataArrayToDisplay] = useState([]);

    useEffect(() => {
      const updateDataArray = () => {
        const filteredData = dataOptions?.filter(option => option?.networkCode === formData?.networkCode);
        setDataArrayToDisplay(filteredData);
      };
  
      if (formData?.networkCode) {
        updateDataArray();
      }
    }, [formData, dataOptions]);
    
    const setData = (item) => {
        if(!formData?.phoneNumber){
            setPhoneNumberError('Enter Phone Number')
            return
        }
        setformData({...formData, dataPrice:item.price, dataCode:item.dataCode, discountAllowed:item?.discountAllowed, bundleDetail: `${formData?.network} ${item?.planName} ${item?.planType} Valid for ${item?.validity}`})
        setSelectedCard('dataPopup')
    }

  return (
    <div>
        <div className="flex items-center gap-2 text-yellow-500 font-medium text-[17px] phone:text-[14x] small-phone:text-[13px]">
            <img src={LogoImg} alt='logo' className='w-[30px] phone:w-[25px] small-phone:w-[20px]' />
            {cashPoint} bravePoints <span className="text-black">available</span> 
        </div>
        <p className="font-medium mt-2 phone:mt-4 pb-2 border-b-[3px] mb-2 border-black phone:border-b-2">{formData?.network} Data Plans</p>
        
        <div className='flex gap-3 flex-wrap mt-3 justify-center'>
            {
              isFetchingDataPlans ? (
                <div className='flex w-full items-center justify-center '>
                  <div class="mt-[4rem] mb-[4rem] loading-spinner"></div>
                </div>
              ) : (
                    dataArrayToDisplay?.map((item, idx) => (
                        <div onClick={() => setData(item)} key={idx} className='flex flex-col items-center p-2 border border-gray-500 rounded-2xl gap-2 cursor-pointer'>
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
                                {`${item?.discountAllowed} cashback`}
                            </span>
                        </div>
                    )) 
              )
            }
        </div>
    </div>
  )
}

export default DataPlans