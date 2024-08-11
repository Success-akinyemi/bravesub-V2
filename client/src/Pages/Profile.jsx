import { useDispatch, useSelector } from "react-redux";
import FootNav from "../Components/FootNav"
import Navbar from "../Components/Navbar"
import { useEffect, useState } from "react";
import { updateUser } from "../Helpers/api";
import LoadingBtn from "../Components/Helpers/LoadingBtn";
import toast from "react-hot-toast";
import { signInSuccess } from "../Redux/user/userSlice";
import {CopyToClipboard} from 'react-copy-to-clipboard';

function Profile({formData, setFormData}) {
  const dispatch = useDispatch()
  const { currentUser } = useSelector((state) => state.braveSubUser);
  const user = currentUser?.data
  const [ isLoading, setIsLoading ] = useState(false)
  useEffect(() => {
    setFormData(user)
  }, [])

  const handleChange = (e) => {
    setFormData({...formData, [e.target.id]: e.target.value})
  }

  function formatBalance(balance) {
    return new Intl.NumberFormat('en-US', {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2
    }).format(balance);
}

  //useEffect(() => {console.log(formData)}, [formData])


  const handleUpdateUser = async (e) => {
    e.preventDefault()
    try {
      setIsLoading(true)
      const res = await updateUser(formData)
      //console.log('res', res)
      if(res.success){
        toast.success('User Info Updated')
        dispatch(signInSuccess(res))
      }
    } catch (error) {
      
    } finally {
      setIsLoading(false)
    }
  } 

  const clicked = () => {
    toast.success('Link Copied')  
  }

  return (
    <div className="page">
        <Navbar />
        <div className="flex flex-col phone:mb-[10rem] mb-[3rem]">
          <form onSubmit={handleUpdateUser} className="w-full bg-white rounded-3xl p-3 flex flex-col">
            <div className="inputGroup gap-1 mb-4">
              <label className="font-semibold" htmlFor="email">Email</label>
              <input type="email" id="email" defaultValue={formData?.email} onChange={handleChange} />
            </div>
            <div className="inputGroup gap-1 mb-4">
              <label className="font-semibold" htmlFor="username">User Name</label>
              <input type="text" id="username" defaultValue={formData?.username} onChange={handleChange} />
            </div>
            <div className="inputGroup gap-1 mb-4">
              <label className="font-semibold" htmlFor="firstName">First Name</label>
              <input type="text" id="firstName" defaultValue={formData?.firstName} onChange={handleChange} />
            </div>
            <div className="inputGroup gap-1 mb-4">
              <label className="font-semibold" htmlFor="lastName">Last Name</label>
              <input type="text" id="lastName" defaultValue={formData?.lastName} onChange={handleChange} />
            </div>
            <div className="inputGroup gap-1 mb-4">
              <label className="font-semibold" htmlFor="mobile">Mobile</label>
              <input type="text" id="mobile" defaultValue={formData?.mobile} onChange={handleChange} />
            </div>
            <div className="inputGroup gap-1 mb-4">
              <label className="font-semibold" htmlFor="mobile">Whatsapp Number</label>
              <input type="text" id="whatsappNumber" defaultValue={formData?.whatsappNumber} onChange={handleChange} />
            </div>

            <div>
              {
                isLoading ? (
                  <LoadingBtn />
                ) : (
                  <button type="submit" className="btn">Update</button>
                )
              }
            </div>
          </form>

          <div className="mt-8 bg-white p-3 rounded-3xl flex flex-col">
              <div>
                <div className="w-ful flex items-center justify-center flex-col">
                <small className="w-full font-bold text-[13px]">Your Referral link:</small>
                <input type="text" className="bg-purple-300 border-0 rounded-sm text-[14px]" disabled value={user?.referralLink} />
                  <CopyToClipboard text={user.referralLink} onCopy={clicked} >
                        <div className="mt-2">
                            <span className='btn text-center rounded-md p-1'>Copy</span>
                        </div>
                  </CopyToClipboard>
                </div>
              </div>

              <div className="mt-6">
                <small className="w-full font-bold text-[13px]">Availble wallet balance:</small>
                <input type="text" className="bg-purple-300 border-0 rounded-sm text-[14px]" disabled value={formatBalance(user.acctBalance)} />
              </div>

              <div className="mt-6">
                <small className="w-full font-bold text-[13px]">Availble cash Point balance:</small>
                <input type="text" className="bg-purple-300 border-0 rounded-sm text-[14px]" disabled value={user?.cashPoint} />
              </div>


          </div>

        </div>
        <FootNav />
    </div>
  )
}

export default Profile