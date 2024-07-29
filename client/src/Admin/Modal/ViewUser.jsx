import { useEffect, useState } from "react"
import LoadingBtn from "../../Components/Helpers/LoadingBtn"
import { adminUpdateUser, makeAdmin } from "../../Helpers/api"
import toast from "react-hot-toast"

function ViewUser({ formData, setFormData }) {
  const [ isLoading, setIsLoading ] = useState(false)
  const [ isLoadingAdmin, setIsLoadingAdmin ] = useState(false)
  const [ blocked, setBlocked ] = useState(false)

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.id]: e.target.value })
  }
  //useEffect(() => {console.log('DATA', formData)}, [formData])
  
  const handleBlocked = (state) => {
    setBlocked((prev) => !prev)
    setFormData({ ...formData, blocked: state })
  }

  const handleAdminUpdateUser = async (e) => {
    e.preventDefault()
    try {
        setIsLoading(true)
        const confirm = window.confirm('Are you sure you want to update this user?')
        if(confirm){
            const res = await adminUpdateUser(formData)
            if(res.success){
                toast.success(res.data)
                window.location.reload()
            }
        }
    } catch (error) {
        
    } finally{
        setIsLoading(false)
    }
  }

  const handleMakeAdmin = async (id) => {
        try {
            const confirm = window.confirm('Are you sure you want to make this user Id?')
            if(confirm){
                const passCode = prompt('Enter a Pass Code for new Admin.')
                console.log('PASSCODE', passCode)
                if(!passCode){
                    toast.error('Please Enter Pass Code.')
                    return
                }
                setIsLoadingAdmin(true)
                const res = await makeAdmin({id, passCode})
            }
        } catch (error) {
            
        } finally {
            setIsLoadingAdmin(false)
        }
    }

  return (
    <div className="absolute mt-3 left-0 top-0 w-full h-full overflow-y-auto flex flex-col">
        <form onSubmit={handleAdminUpdateUser}  className="flex flex-col">
            <div className="flex items-center justify-between">
                <div className="flex items-center gap-1">
                    {formData?.verified ? 'Verified': 'Not Verifed'}:
                    <span className={`h-[20px] w-[20px] small-phone:h-[15px] small-phone:w-[15px] rounded-full ${formData?.verified ? 'bg-green-700' : 'bg-red-700'}`}></span>
                </div>
                <div className="flex items-center gap-1">
                    Transactions Total:
                    <span>{formData?.transactionTotal}</span>
                </div>
            </div>
            <div className="w-full bg-white p-3 rounded-2xl mt-[1rem] flex flex-col mb-3">
                    <div className="flex items-center w-ful border-b-2 p-2 mb-2 gap-2">
                    <p className="font-bold">ID:</p>
                    <p className="ml-auto">{formData?._id}</p>
                </div>
                <div className="flex items-center w-ful border-b-2 p-2 mb-2 gap-2">
                    <p className="font-bold">First Name:</p>
                    <input type="text" id="firstName" defaultValue={formData?.firstName} onChange={handleChange} />
                </div>
                <div className="flex items-center w-ful border-b-2 p-2 mb-2 gap-2">
                    <p className="font-bold">Last Name:</p>
                    <input type="text" id="lastName" defaultValue={formData?.lastName} onChange={handleChange} />
                </div>
                <div className="flex items-center w-ful border-b-2 p-2 mb-2 gap-2">
                    <p className="font-bold">Email:</p>
                    <input type="text" id="email" defaultValue={formData?.email} onChange={handleChange} />
                </div>
                <div className="flex items-center w-ful border-b-2 p-2 mb-2 gap-2">
                    <p className="font-bold">Mobile:</p>
                    <input type="text" id="mobile" defaultValue={formData?.mobile} onChange={handleChange} />
                </div>
                <div className="flex items-center w-ful border-b-2 p-2 mb-2 gap-2">
                    <p className="font-bold">Username:</p>
                    <input type="text" id="username" defaultValue={formData?.username} onChange={handleChange} />
                </div>
                <div className="flex items-center w-ful border-b-2 p-2 mb-2 gap-2">
                    <p className="font-bold">Referral Link:</p>
                    <input type="text" id="referralLink" defaultValue={formData?.referralLink} onChange={handleChange} />
                </div>
                <div className="flex items-center w-ful border-b-2 p-2 mb-2 gap-2">
                    <p className="font-bold">User Account Balance:</p>
                    <input type="number" id="acctBalance" defaultValue={formData?.acctBalance} onChange={handleChange} />
                </div>
                <div className="flex items-center w-ful border-b-2 p-2 mb-2 gap-2">
                    <p className="font-bold">User Cash Point:</p>
                    <input type="number" id="cashPoint" defaultValue={formData?.cashPoint} onChange={handleChange} />
                </div>
                <small className="font-bold text-red-700">*Please endeavour to calculate the user total transaction and write the new total when updating transaction total</small>
                <div className="flex items-center w-ful border-b-2 p-2 mb-2 gap-2">
                    <p className="font-bold">User Transaction Total:</p>
                    <input type="number" id="transactionTotal" defaultValue={formData?.transactionTotal} onChange={handleChange} />
                </div>
                <div className="flex flex-col items-center w-ful border-b-2 p-2 mb-2 gap-2">
                    <p className="font-bold">Block User 
                        <small className="">
                            ({formData?.blocked ? 'User Blocked' : 'User Not blocked'})
                        </small>
                    :</p>
                    <div onClick={() => handleBlocked(!blocked)} className="btn text-center">{formData?.blocked ? 'Unblock User' : 'Block User'}</div>
                    {blocked && (
                        <small className="w-full text-center font-bold text-red-700" >User will be Blocked</small>
                    )}
                </div>

                <div className="mt-3 mb-2">
                    {
                        isLoading ? (
                            <LoadingBtn />
                        ) : (
                            <button type='submit' disabled={isLoading} className="btn">Update</button>
                        )
                    }
                </div>
            </div>
        </form>

        <div className="mt-4 mb-4">
            {
                isLoadingAdmin ? (
                    <LoadingBtn />
                ) : (
                    <button disabled={setIsLoadingAdmin} onClick={() => handleMakeAdmin(formData?._id)} className="btn text-[15px]">Make Admin</button>
                )
            }
        </div>

    </div>
  )
}

export default ViewUser