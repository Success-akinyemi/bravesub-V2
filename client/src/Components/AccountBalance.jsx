import { IoEyeOutline } from "react-icons/io5"
import { RxEyeClosed } from "react-icons/rx";
import { IoShieldCheckmarkSharp } from "react-icons/io5";
import { Link } from "react-router-dom";
import { useEffect, useState } from "react";
import { IoIosArrowForward } from "react-icons/io";
import { useSelector } from "react-redux";

function AccountBalance() {
    const { currentUser } = useSelector((state) => state.braveSubUser);
    const user = currentUser?.data
    const [showBalance, setShowBalance] = useState(false)

    useEffect(() => {
        const storedShowBalance =  localStorage.getItem('braveShowBalance') === 'true'
        setShowBalance(storedShowBalance);
    }, [])
    
    const handleShowBalance = () => {
        const newShowBalance = !showBalance
        localStorage.setItem('braveShowBalance', newShowBalance)
        setShowBalance(newShowBalance)
    }
  return (
    <div className="bg-light-bg rounded-3xl p-3 pl-5 pr-5 flex flex-col gap-3">
        <div className="flex items-center justify-between">
            <div className="flex items-center gap-3 phone:gap-2">
                <IoShieldCheckmarkSharp className="text-green-500 text-lg" />
                <p className="font-semibold sm:text-sm phone:text-[13px]" >Available Balance</p>
                { showBalance ? 
                    <div onClick={handleShowBalance}>
                        <IoEyeOutline className="text-xl cursor-pointer" /> 
                    </div>
                    :
                    <div onClick={handleShowBalance}>
                        <RxEyeClosed className="text-xl cursor-pointer" />
                    </div> 
                }
            </div>

            <div className="flex items-center">
                <Link className="flex items-center phone:text-[15px]">Transaction Histroy <IoIosArrowForward /> </Link>
            </div>
        </div>

        <div className="flex items-center justify-between mt-4 sm:mt-5">
            <div>
                {
                    showBalance ? 
                        <span className="flex items-center gap-1 text-3xl sm:text-2xl">{Math.round(user.acctBalance).toFixed(2)} <IoIosArrowForward /></span> 
                    : 
                        <span className="text-2xl sm:text-xl">****</span>
                }
            </div>

            <div>
                <Link className="p-2 bg-main-color text-white font-semibold rounded-3xl flex items-center justify-center text-sm" to={'/funding'}>Add Money</Link>
            </div>
        </div>
    </div>
  )
}

export default AccountBalance