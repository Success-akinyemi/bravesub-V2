import { useEffect, useState } from "react"
import LogoImg from '../assets/logo.png'
import { adminLogin } from "../Helpers/api"
import toast from "react-hot-toast"
import { FaArrowLeft } from "react-icons/fa6";
import { FaEye } from "react-icons/fa";
import { FaEyeSlash } from "react-icons/fa";
import LoadingBtn from "../Components/Helpers/LoadingBtn";
import { useDispatch } from "react-redux";
import { signInSuccess } from "../Redux/user/userSlice";
import { useNavigate } from "react-router-dom";

function AdminLogin({formData, setformData}) {
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const [ currentCard, setCurrentCard ] = useState('adminUserCode')
  const [ adminUserCode, setAdminUserCode ] = useState(new Array(4).fill(''))
  const [ passCode, setPassCode ] = useState(new Array(6).fill(''))
  const [ showAdminCode, setShowAdminCode ] = useState(false)
  const [ showPassCode, setShowPasscode ] = useState(false)
  const [ isLoading, setIsLoading ] = useState(false)

  const handleAdminUserCode = (e, index) => {
    if(isNaN(e.target.value)) return false;

    setAdminUserCode([
      ...adminUserCode.map((data, indx) => (indx === index? e.target.value:data))
    ])

    if(e.target.value && e.target.nextSibling){
      e.target.nextSibling.focus()
    }
  }

  const handleNext = () => {
    const adminUserCodeLength = adminUserCode.join('')
    if(adminUserCodeLength?.length !== 4){
        toast.error('Enter Admin Pass Code')
        return;
    }
    setformData({...formData, adminUserCode: adminUserCode.join('')})
    setCurrentCard('passCode')
  }

  const handlePassCode = (e, index) => {
    //if(isNaN(e.target.value)) return false;

    setPassCode([
      ...passCode.map((data, indx) => (indx === index? e.target.value:data))
    ])

    if(e.target.value && e.target.nextSibling){
      e.target.nextSibling.focus()
    }
    
  }
  
/**
 * 
useEffect(() => {
  console.log('ADMIN FORM', formData)
}, [formData])
 */

  const handleLogin = async (e) => {
    e.preventDefault()

    const passCodeLength = passCode.join('')
    if(passCodeLength?.length === 6){
      setformData({...formData, passCode: passCode.join('')})
    }

    if(!formData.adminUserCode){
      toast.error('Enter Admin User Code')
      setCurrentCard('adminUserCode')
      return;
    }

    if(!formData.passCode){
      toast.error('Enter PassCode')
      return;
    }
    try {
      setIsLoading(true)
      const res = await adminLogin(formData)
      if(res){
        dispatch(signInSuccess(res.data))
        localStorage.setItem('bravesubAtoken', res?.token)
        
        navigate('/admin-dashboard')
      }
    } catch (error) {
      
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="page pt-0 flex items-center justify-center flex-col">
      <div className='flex items-center gap-2 mb-3'>
        <img src={LogoImg} className='w-[35px]' alt='brave sub logo' />
        <span className='text-[30px] phone:text-[20px]'>Bravesub</span>
      </div>

      <form onSubmit={handleLogin} className="flex flex-col p-6 bg-white rounded-3xl shadow-xl w-[50vw] phone:w-[85vw]">
        {
          currentCard === 'adminUserCode' && (
            <div className="">
              <div className="inputGroup gap-[-4rem]">
                <label className='font-semibold phone:text-[15px]' htmlFor="admin User Code">Enter Admin User Code</label>
                <div className="flex items-center w-full gap-2">
                  {
                    adminUserCode.map((data, i) => {
                      return <input 
                                type={showAdminCode ? 'text' : 'password'} 
                                value={data} 
                                maxLength={1} 
                                onChange={(e) => handleAdminUserCode(e, i)} 
                                className="text-center text-[18px]"
                            />
                    })
                  }
                  <span onClick={() => setShowAdminCode((prev) => !prev)}>
                    {
                      showAdminCode ? (
                        <FaEye className="text-[20px] cursor-pointer" />
                      ) : (
                        <FaEyeSlash className="text-[20px] cursor-pointer" />
                      )
                    }
                  </span>
                </div>
              </div>

              <div className="mt-[2rem]">
                <button className="btn" onClick={handleNext}>
                  Procced
                </button>
              </div>
            </div>
          )
        }

        {
          currentCard === 'passCode' && (
            <div className="flex flex-col">
              <span className="mb-[1rem]" onClick={() => setCurrentCard('adminUserCode')}>
                <FaArrowLeft className="cursor-pointer text-[20px]" />
              </span>
              <div className="inputGroup gap-[-4rem]">
                <label className='font-semibold phone:text-[15px]' htmlFor="admin User Code">Enter Admin Passcode</label>
                <div className="flex items-center w-full gap-2">
                  {
                    passCode.map((data, i) => {
                      return <input 
                                type={showPassCode ? 'text' : 'password'} 
                                value={data} 
                                maxLength={1} 
                                onChange={(e) => handlePassCode(e, i)} 
                                className="text-center text-[18px]"
                            />
                    })
                  }
                  <span onClick={() => setShowPasscode((prev) => !prev)}>
                    {
                      showPassCode ? (
                        <FaEye className="text-[20px] cursor-pointer" />
                      ) : (
                        <FaEyeSlash className="text-[20px] cursor-pointer" />
                      )
                    }
                  </span>
                </div>
              </div>

              <div className="mt-[2rem]">
              {
                isLoading ? (
                  <LoadingBtn />
                ) : (
                  <button disabled={isLoading} className="btn" type="submit" onClick={handleLogin}>
                    Submit
                  </button>
                )
              }
              </div>
            </div>
          )
        }
      </form>
    </div>
  )
}

export default AdminLogin