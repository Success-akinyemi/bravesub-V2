import { FaArrowLeftLong } from "react-icons/fa6";
import { Link } from "react-router-dom";
import { BsBank2 } from "react-icons/bs";
import Banner from "../Components/Banner";
import { useSelector } from "react-redux";
import { useState } from "react";
import LoadingBtn from "../Components/Helpers/LoadingBtn";
import { paystackFunding } from "../Helpers/api";

function Funding() {
    const { currentUser } = useSelector((state) => state.braveSubUser);
    const user = currentUser?.data
    const [ formData, setformData ] = useState({email: user.email})
    const [ errorMsg, setErrorMsg ] = useState(null)
    const [ isLoading, setIsLoading ] = useState(false)

    const handleInputs = (e) => {
        setErrorMsg(null)
        setformData({...formData, [e.target.id]: e.target.value })
    }

    const handleFunding = async (e) => {
        e.preventDefault()
        if(!formData.amount){
            setErrorMsg('Enter Amount')
            return
        }
        try {
            setIsLoading(true)
            const res = await paystackFunding(formData)
        } catch (error) {
            
        } finally {
            setIsLoading(false)
        }
    }

  return (
    <div className="page pt-0">
        <div className="pagination w-full bg-white h-[50px] absolute left-0 right-0 flex items-center justify-between z-10">
            <div className="flex items-center gap-3">
                <Link className="" to={'/dashboard'}>
                    <FaArrowLeftLong className="text-[25px]" />
                </Link>
                <h2 className="text-[20px] font-semibold">
                    Add Money
                </h2>
            </div>

        </div>

        <form onSubmit={handleFunding} className="bg-white rounded-3xl p-3 mt-[5rem]">
            <div className="flex items-center gap-3">
                <div className="flex items-center justify-center p-2 bg-main-color rounded-full">
                    <BsBank2 className="text-white size-[25px]" />
                </div>
                <div>
                    <h3 className="font-bold ">Via Bank Transfer</h3>
                    <p className="text-[15px] phone:text-[12px] text-gray-700 " >FREE Instant funding via bank. - Enjoy zero transaction fees</p>
                </div>
            </div>

            <hr className="mt-3 border-[1px]" />

            <div className="w-full flex flex-col mt-4">
                <input type="number" onChange={handleInputs} className={`${errorMsg ? 'border-b-red-600' : ''}`} placeholder="Enter Amount" id="amount" />
                {
                    errorMsg && (
                        <p className="text-red-600 font-semibold">{errorMsg}</p>
                    )
                }
                <div className="mt-10">
                    {
                        isLoading ? (
                            <LoadingBtn />
                        ) : (
                            <button type="submit" className="btn" >Add funds</button>
                        )
                    }
                </div>
            </div>
        </form>

        <div className="mt-12">
            <Banner />
        </div>
    </div>
  )
}

export default Funding