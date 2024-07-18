import { useState } from "react"
import LoadingBtn from "../../Components/Helpers/LoadingBtn"
import LogoImg from '../../assets/logo.png'
import { Link } from "react-router-dom"
import { forgotPassword } from "../../Helpers/api"

function ForgotPassword({formData, setformData}) {
    const [ isLoading, setIsLoading ] = useState(false)

    const handleInputs = (e) => {
        setformData({...formData, [e.target.id]: e.target.value })
      }
    
      const handleForgotPassword = async (e) => {
        e.preventDefault()
        if(!formData.email){
          toast.error('Enter registered email')
          return;
        }
        try {
          setIsLoading(true)
            const res = await forgotPassword(formData)
            if (res?.success) {
              navigate("/reset-email-sent", {
                state: { resMsg: `${res?.msg} to ${res?.data}` },
              });
          } 
        } catch (error) {
            
        } finally {
          setIsLoading(false)
        }
    }
  return (
    <form onSubmit={handleForgotPassword} className="page pt-0 flex flex-col items-center justify-center">
        <div className='flex items-center gap-2 mb-3'>
            <img src={LogoImg} className='w-[35px]' alt='brave sub logo' />
            <span className='text-[30px] phone:text-[20px]'>Bravesub</span>
        </div>
        <div className='flex flex-col p-6 bg-white rounded-3xl shadow-xl gap-6 w-[50vw] phone:w-[85vw]' >
            <div className="inputGroup">
                <label className='font-semibold phone:text-[15px]' htmlFor="Email Address">Enter Registered Email Address</label>
                <input className='text-[18px] phone:text-[17px]' onChange={handleInputs} type="text" id="email" />
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

            <span className="m-auto text-[17px] phone:text-[15px]">Remeber password? <Link to='/login' className="text-main-color font-semibold">Login</Link> </span>
        </div>
    </form>
  )
}

export default ForgotPassword