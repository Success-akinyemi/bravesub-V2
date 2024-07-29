import { useEffect, useState } from 'react';
import LogoImg from '../../assets/logo.png'
import { FaEye } from "react-icons/fa";
import { FaEyeSlash } from "react-icons/fa";
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { registerUser } from '../../Helpers/api';
import toast from 'react-hot-toast';
import LoadingBtn from '../../Components/Helpers/LoadingBtn';

function Register({formData, setformData}) {
    const location = useLocation();
    const queryParams = new URLSearchParams(location.search);
    const refParams = queryParams.get("ref");
    const referredBy = refParams;

    useEffect(() => {
        if(referredBy){
            setformData({ ...formData, referredBy: referredBy })
        }
    }, [])

    useEffect(() => {console.log(formData)}, [formData])

    const navigate = useNavigate()
    const [ passwordVisible, setPasswordVisible ] = useState(false)
    const [ confirmPasswordVisible, setConfirmPasswordVisible ] = useState(false)
    const [ isLoading, setIsLoading ] = useState(false)

    const handleInputs = (e) => {
        setformData({...formData, [e.target.id]: e.target.value })
    }

    const handleRegister = async (e) => {
        e.preventDefault()
        if(!formData.firstName){
            toast.error(`Enter First Name`)
            return
        }
        if(!formData.lastName){
            toast.error(`Enter Last Name`)
            return
        }
        if(!formData.email){
            toast.error('Enter Email')
            return
        }
        if(!formData.username){
            toast.error('Enter Username')
            return
        }
        if(!formData.mobile){
            toast.error('Enter Phone Number')
            return
        }
        if(!formData.password){
            toast.error('Enter Password')
            return
        }
        if(!formData.ConfirmPassword){
            toast.error('Enter Confirm Password')
            return
        }

        const specialChars = /[!@#$%^&*()_+{}[\]\\|;:'",.<>?]/
        if(!specialChars.test(formData.password)){
            toast.error('Password must contain at least one special character')
            return
        }

        if(formData.password.length < 6){
            toast.error('Password must be 6 characters long')
            return
        }

        if(formData.password !== formData.ConfirmPassword){
            toast.error('Password do not match')
            return
        }

        try {
            setIsLoading(true)
            const res = await registerUser(formData)
            //console.log('first', res)
            if(res.success){
                //console.log('res', res)
                navigate("/email-verification", {
                    state: { resMsg: `${res?.data}` },
                  });
            }
        } catch (error) {
            
        } finally{
            setIsLoading(false)
        }
    }
  return (
    <form onSubmit={handleRegister} className="page pt-0 flex flex-col items-center justify-center">
        <div className='flex items-center gap-2 mb-3'>
            <img src={LogoImg} className='w-[35px]' alt='brave sub logo' />
            <span className='text-[30px] phone:text-[20px]'>Bravesub</span>
        </div>
        <div className='flex flex-col p-6 bg-white rounded-3xl shadow-xl gap-3 w-[50vw] phone:w-[85vw]' >
            <div className="inputGroup">
                <label className='font-semibold phone:text-[15px]' htmlFor="First Name">First Name</label>
                <input className='text-[18px] phone:text-[17px]' onChange={handleInputs} type="text" id="firstName" />
            </div>
            <div className="inputGroup">
                <label className='font-semibold phone:text-[15px]' htmlFor="Last Name">Last Name</label>
                <input className='text-[18px] phone:text-[17px]' onChange={handleInputs} type="text" id="lastName" />
            </div>
            <div className="inputGroup">
                <label className='font-semibold phone:text-[15px]' htmlFor="Email Address">Email Address</label>
                <input className='text-[18px] phone:text-[17px]' onChange={handleInputs} type="text" id="email" />
            </div>
            <div className="inputGroup">
                <label className='font-semibold phone:text-[15px]' htmlFor="User Name">User Name</label>
                <input className='text-[18px] phone:text-[17px]' onChange={handleInputs} type="text" id="username"/>
            </div>
            <div className="inputGroup">
                <label className='font-semibold phone:text-[15px]' htmlFor="Phone Number">Phone Number</label>
                <input className='text-[18px] phone:text-[17px]' onChange={handleInputs} type="text" id="mobile" />
            </div>
            <div className="inputGroup">
                <label className='font-semibold phone:text-[15px]' htmlFor="Password">Password</label>
                <input className='text-[18px] phone:text-[17px]' onChange={handleInputs} type={passwordVisible ? 'text' : 'password'} id="password" />
                <div onClick={() => setPasswordVisible((prev) => !prev)} className='absolute z-20 right-0 bottom-4 text-[25px] cursor-pointer' >
                    {
                        passwordVisible ? (
                            <FaEye />
                        ) : (
                            <FaEyeSlash />
                        )
                    }
                </div>
            </div>
            <div className="inputGroup">
                <label className='font-semibold phone:text-[15px]' htmlFor="Confirm Password">Confirm Password</label>
                <input className='text-[18px] phone:text-[17px]' onChange={handleInputs} type={confirmPasswordVisible ? 'text' : 'password'} id="ConfirmPassword" />
                <div onClick={() => setConfirmPasswordVisible((prev) => !prev)} className='absolute z-20 right-0 bottom-4 text-[25px] cursor-pointer' >
                    {
                        confirmPasswordVisible ? (
                            <FaEye  />
                        ) : (
                            <FaEyeSlash />
                        )
                    }
                </div>    
            </div>

            <div className='mt-3'>
                {
                    isLoading ? (
                        <LoadingBtn />
                    ) : (
                        <button type='submit' className="btn">Register</button>
                    )
                }
            </div>

            <span className="m-auto text-[17px] phone:text-[15px]">Already a User? <Link to='/login' className="text-main-color font-semibold">Login here</Link> </span>
        </div>
    </form>
  )
}

export default Register