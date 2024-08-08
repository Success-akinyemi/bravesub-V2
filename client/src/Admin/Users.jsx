import { FaArrowLeftLong } from "react-icons/fa6"
import { Link } from "react-router-dom"
import { users } from "./data/users"
import { useState } from "react"
import { useFetchAllUsers } from "../Helpers/fetch.hooks"
import FootNav from "./Components/FootNav"

function Users({setSelectedCard, setFormData}) {
    const [ searchQuery, setSearchQuery ] = useState('')
    const { allUsers, isFetchingAllusers } = useFetchAllUsers()

    //const allUsersData = users
    const allUsersData = allUsers?.data
    const sortedUsers = allUsersData?.sort((a, b) => new Date(b?.createdAt) - new Date(a?.createdAt))
    
    const filteredData = sortedUsers?.filter(item => {
        const query = searchQuery.toLowerCase()
        return (
            item?.email?.toLowerCase().includes(query) ||
            item?.mobile?.toLowerCase().includes(query) ||
            item?.username?.toLowerCase().includes(query) ||
            item?.whatsappNumber?.toLowerCase().includes(query)
        )
        }
    )

    const handleUser = (item) => {
        setFormData(item)
        setSelectedCard('viewUser')
    }


  return (
    <div className="page pt-0">
        <div className="pagination w-full bg-white h-[50px] fixed left-0 right-0 flex items-center justify-between z-30">
            <div className="flex items-center gap-3 small-phone:gap-[10px]">
                <Link className="" to={'/admin-dashboard'}>
                    <FaArrowLeftLong className="text-[25px] small-phone:text-[20px]" />
                </Link>
                <h2 className="text-[20px] phone:[17px] small-phone:text-[15px] font-semibold">
                    All Users
                </h2>
            </div>

        </div>

        <div className="mt-[4rem] mb-[3rem] bg-white w-full rounded-xl p-3 flex flex-col">
            <input value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} />
            <div className="w-full mt-6">
                <btn className="btn w-full phone:text-[14px]">Search</btn>
            </div>
        </div>

        <span className="font-bold">
            Total Users: {allUsers?.length}
        </span>
        <div className="mt-[1rem] bg-white w-full rounded-xl p-3">
            {
                isFetchingAllusers ? (
                    <div className='flex w-full items-center justify-center '>
                        <div class="mt-[4rem] mb-[4rem] loading-spinner"></div>
                    </div>
                ) : (
                    filteredData?.map((item) => (
                        <div key={item._id} onClick={() => handleUser(item)} className="mb-3 border-b-2 pb-2 flex items-center">
                            <div className="flex items-center gap-1 mr-3">
                                <p>{item?.firstName}</p>
                            </div>
                            <p className="phone:text-[15px] text-gray-600">{item?.email}</p>
                            <div className="ml-auto">
                                <span className="btn flex items-center justify-center text-center pl-4 pr-4 pt-1 pb-1 phone:text-[13px]">View</span>
                            </div>
                        </div>
                    ))
                )
            }
        </div>

        <FootNav />
    </div>
  )
}

export default Users