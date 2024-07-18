import ProfileImg from '../assets/profile.png'
import { FaHeadset } from "react-icons/fa";
import { LuBell } from "react-icons/lu";
import { useSelector } from 'react-redux';

function Navbar() {
  const { currentUser } = useSelector((state) => state.braveSubUser);
  const user = currentUser?.data

  return (
    <div className="bg-main-bg flex items-center justify-between md:p-5 phone:pl-4 phone:pr-4 h-16 fixed top-0 left-0 w-full z-30">
        <div className='flex items-center gap-4' >
            <div className='bg-purple-300 rounded-full'>
              <img className='w-[40px]' src={user.profile} alt={`${user.username}`} />
            </div>

            <div className='flex flex-col'>
                <h2 className='font-bold'>Hi, {user.username}</h2>
                <p className='text-sm text-gray-600'>Welcome, lets connect you!</p>
            </div>
        </div>

        <div className='flex items-center gap-8'>
            <div>
              <FaHeadset className='size-7' />
            </div>

            <div className='relative'>
              <span className='absolute pt-[2px] pb-[2px] pl-[3px] pr-[3px] bg-red-600 text-white flex items-center justify-center rounded-3xl text-xs font-medium top-[-10px] left-[6px]'>99+</span>
              <LuBell className='size-7' />
            </div>
        </div>
    </div>
  )
}

export default Navbar