import { useState } from "react"
import LogoImg from '../../assets/logo.png'
import { FaEye } from "react-icons/fa";
import { FaEyeSlash } from "react-icons/fa";
import toast from "react-hot-toast";
import { loginUser } from "../../Helpers/api";
import { Link, useNavigate } from "react-router-dom";
import LoadingBtn from "../../Components/Helpers/LoadingBtn";
import { useDispatch } from "react-redux";
import { signInSuccess } from "../../Redux/user/userSlice";

function login({formData, setformData}) {
  const navigate = useNavigate()
  const dispatch = useDispatch()
  const [ passwordVisible, setPasswordVisible ] = useState(false)
  const [ isLoading, setIsLoading ] = useState(false)
  
  const handleInputs = (e) => {
    setformData({...formData, [e.target.id]: e.target.value })
  }

  const handleLogin = async (e) => {
    e.preventDefault()
    if(!formData.emailOrMobile){
      toast.error('Enter registered email or mobile number')
      return;
    }
    if(!formData.password){
      toast.error('Enter password')
      return;
    }
    try {
      setIsLoading(true)
        const res = await loginUser(formData)
        if(res.isVerified === false){
          navigate("/email-verification", {
            state: { resMsg: res?.data },
          });
        } else{
          //console.log('USER', res)
          localStorage.setItem('bravesubtoken', res.token)
          navigate('/dashboard')
          dispatch(signInSuccess(res.data))
        }
    } catch (error) {
        
    } finally {
      setIsLoading(false)
    }
}

return (
  <form onSubmit={handleLogin} className="page pt-0 flex flex-col items-center justify-center">
      <div className='flex items-center gap-2 mb-3'>
          <img src={LogoImg} className='w-[35px]' alt='brave sub logo' />
          <span className='text-[30px] phone:text-[20px]'>Bravesub</span>
      </div>
      <div className='flex flex-col p-6 bg-white rounded-3xl shadow-xl gap-10 w-[50vw] phone:w-[85vw]' >
          <div className="inputGroup">
              <label className='font-semibold phone:text-[15px]' htmlFor="Email Address or Phone Number">Email Address or Phone Number</label>
              <input className='text-[18px] phone:text-[17px]' onChange={handleInputs} type="text" id="emailOrMobile" />
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

          <div className='mt-3'>
            {
              isLoading ? (
                <LoadingBtn />
              ) :(
                <button type='submit' className="btn">Login</button>
              )
            }
          </div>
          <span className="m-auto text-[17px] phone:text-[15px]">Forgot Password? <Link to='/forgot-password' className="text-main-color font-semibold">Recover here</Link> </span>
          <span className="m-auto mt-[-2rem] text-[17px] phone:text-[15px]">New User? <Link to='/register' className="text-main-color font-semibold">Register here</Link> </span>
      </div>

  </form>
)
}

export default login