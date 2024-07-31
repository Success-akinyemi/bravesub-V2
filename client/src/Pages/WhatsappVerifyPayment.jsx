import { useLocation } from "react-router-dom";
import { verifyPaystackPayment } from "../Helpers/api";
import { useEffect } from "react";
import LogoImg from '../assets/logo.png'

function WhatsappVerifyPayment() {
    const location = useLocation();
  
    useEffect(() => {
        const query = new URLSearchParams(location.search);
        const paymentReference = query.get('reference');
    
        if (paymentReference) {
          const postPaymentReference = async (reference) => {
            try {
              const res = await verifyPaystackPayment({ paymentReference: reference });
              //console.log('Server response:', res.data);
              if(res.success){
                toast.success('Account Funding Successful')
                //redirect back to whatsapp
              }
            } catch (error) {
              console.error('Error posting payment reference:', error);
            }
          };
    
          postPaymentReference(paymentReference);
        }
      }, [location]);

  return (
    <div className="page pt-0 flex items-center justify-center flex-col">
        <div className='flex items-center gap-2 mb-3'>
            <img src={LogoImg} className='w-[35px]' alt='brave sub logo' />
            <span className='text-[30px] phone:text-[20px]'>Bravesub</span>
        </div>
        <div className="flex flex-col items-center justify-center p-4 bg-white shadow-xl gap-3 rounded-xl">
            <div className="flex flex-col">
                <p className="mb-4">Verifying Payment please wait...</p>
                <div className="loading"></div>
            </div>
        </div>
    </div>
  )
}

export default WhatsappVerifyPayment