import { useEffect, useState } from 'react'
import LogoImg from '../assets/logo.png'
import { useLocation } from 'react-router-dom';
import toast from 'react-hot-toast';
import LoadingBtn from '../Components/Helpers/LoadingBtn';
import { handleWhatappPay } from '../Helpers/api';

function WhatsappPayment({formData, setformData}) {
    const location = useLocation();
    const queryParams = new URLSearchParams(location.search);
    const amount = queryParams.get('amount');
    const email = queryParams.get('email');

    const [ isLoading, setIsLoading ] = useState(false)

    useEffect(() => {
        if(email && amount){
            setformData({ email, amount, fromWhatsApp: true })
        }
    }, [])
  
    const handleInputs = (e) => {
      setformData({...formData, [e.target.id]: e.target.value })
    }

    const handlePay = async (e) => {
        e.preventDefault()
        if(!formData?.email){
            toast.error('Enter an email')
            return
        }
        if(!formData?.amount){
            toast.error('Enter an amount')
            return
        }
        try {
            setIsLoading(true)
            const res = await handleWhatappPay(formData)
        } catch (error) {
            
        } finally{
            setIsLoading(false)
        }
    }

  return (
    <form onSubmit={handlePay} className="page pt-0 flex flex-col items-center justify-center">
    <div className='flex items-center gap-2 mb-3'>
        <img src={LogoImg} className='w-[35px]' alt='brave sub logo' />
        <span className='text-[30px] phone:text-[20px]'>Bravesub</span>
    </div>
    <p className='text-center text-[17px] phone:text-[15px] small-phone:text-[13px] mb-3'>Complete payment here to fund your account</p>
    <div className='flex flex-col p-6 bg-white rounded-3xl shadow-xl gap-10 w-[50vw] phone:w-[85vw]' >
        <div className="inputGroup">
            <label className='font-semibold phone:text-[15px]' htmlFor="Email Address">Email Address</label>
            <input className='text-[18px] phone:text-[17px]' onChange={handleInputs} type="email" id="email" defaultValue={email} />
        </div>

        <div className="inputGroup">
            <label className='font-semibold phone:text-[15px]' htmlFor="Email Address or Phone Number">Amount</label>
            <input className='text-[18px] phone:text-[17px]' onChange={handleInputs} type="number" id="amount" defaultValue={amount} />
        </div>


        <div className='mt-3'>
          {
            isLoading ? (
              <LoadingBtn />
            ) :(
              <button type='submit' className="btn">Pay</button>
            )
          }
        </div>

    </div>

</form>
  )
}

export default WhatsappPayment