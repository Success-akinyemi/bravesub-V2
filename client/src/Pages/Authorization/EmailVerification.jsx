import { useLocation } from "react-router-dom";
import { PiEnvelope } from 'react-icons/pi'
import LogoImg from '../../assets/logo.png'

function EmailVerification() {
    const location = useLocation();
    const msg = location.state ? location.state.resMsg : 'Please Check your Email to verify Email';
    
    const openEmailApp = () => {
        window.location.href = 'mailto:';
    };

    return (
    <div className="page pt-0 flex items-center justify-center flex-col">
        <div className='flex items-center gap-2 mb-3'>
            <img src={LogoImg} className='w-[35px]' alt='brave sub logo' />
            <span className='text-[30px] phone:text-[20px]'>Bravesub</span>
        </div>
        <div className="flex flex-col items-center justify-center p-4 bg-white shadow-xl gap-3 rounded-xl">
            <div className="flex flex-col gap-2 text-center">
                <h2 className='text-[24px] phone:text-[20px] font-bold'>Account Creeated Successfully</h2>
                <small className="">Your account has been successfully created</small>
            </div>

            <p className="text-main-color font-medium mt-[2rem]">
                {msg}
            </p>

            <div className="flex items-center gap-2 mt-8 text-white p-3 bg-main-color rounded-xl cursor-pointer" onClick={openEmailApp}>
                Click to go to Email <PiEnvelope className='text-[24px]' />
            </div>

            <small className='text-red-600 font-bold'>Check spam box for email sent also</small>
        </div>
    </div>
  )
}

export default EmailVerification