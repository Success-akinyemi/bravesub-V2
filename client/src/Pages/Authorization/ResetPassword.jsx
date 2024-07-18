import { useEffect, useState } from "react"
import toast from "react-hot-toast"
import { useLocation, useNavigate } from "react-router-dom"
import LoadingBtn from "../../Components/Helpers/LoadingBtn"
import { FaEye, FaEyeSlash } from "react-icons/fa6"
import LogoImg from '../../assets/logo.png'
import { resetPassword } from "../../Helpers/api"

function ResetPassword() {
    const navigate = useNavigate()
    const location = useLocation();
    const path = location.pathname.split("/")[2];
    const resetToken = path;
    const [ formData, setformData ] = useState({ resetToken: resetToken }) 
  const [ passwordVisible, setPasswordVisible ] = useState(false)
  const [ confirmPasswordVisible, setConfirmPasswordVisible ] = useState(false)
  const [ isLoading, setIsLoading ] = useState(false)

  const handleInputs = (e) => {
    setformData({...formData, [e.target.id]: e.target.value })
  }

  const handleResetPassword = async (e) => {
      e.preventDefault()
      if(!formData.password){
          toast.error('Enter Password')
          return
      }
      if(!formData.confirmPassword){
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

      if(formData.password !== formData.confirmPassword){
          toast.error('Password do not match')
          return
      }

      try {
          setIsLoading(true)
          const res = await resetPassword(formData)
          if(res.success){
              console.log('res', res)
              navigate("/login");
          }
      } catch (error) {
          
      } finally{
          setIsLoading(false)
      }
  }
  return (
    <form onSubmit={handleResetPassword} className="page pt-0 flex flex-col items-center justify-center">
        <div className='flex items-center gap-2 mb-3'>
            <img src={LogoImg} className='w-[35px]' alt='brave sub logo' />
            <span className='text-[30px] phone:text-[20px]'>Bravesub</span>
        </div>
        <div className='flex flex-col p-6 bg-white rounded-3xl shadow-xl gap-3 w-[50vw] phone:w-[85vw]' >
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
                <input className='text-[18px] phone:text-[17px]' onChange={handleInputs} type={confirmPasswordVisible ? 'text' : 'password'} id="confirmPassword" />
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
                        <button type='submit' className="btn">Submit</button>
                    )
                }
            </div>
        </div>
    </form>
  )
}

export default ResetPassword