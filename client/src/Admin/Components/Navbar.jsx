import ProfileImg from '../../assets/profile.png'
import { FaHeadset } from "react-icons/fa";
import { LuBell } from "react-icons/lu";
import { useSelector } from 'react-redux';

function Navbar() {
  const { currentUser } = useSelector((state) => state.braveSubUser);
  const user = currentUser?.data

  return (
    <div className="bg-main-bg phone:bg-main-bg-2 flex items-center justify-between md:p-5 phone:pl-4 phone:pr-4 h-16 fixed top-0 left-0 w-full z-30">
        <div className='flex items-center gap-4 phone:gap-2' >
            <div className='bg-purple-300 rounded-full'>
              <img className='w-[40px] phone:w-[w-30px] small-phone:w-[30px]' src={user.profile} alt={`${user.username}`} />
            </div>

            <div className='flex flex-col'>
                <h2 className='font-bold phone:text-[14px]'>Hi, {user.username}</h2>
                <p className='text-sm text-gray-600 phone:text-[11.5px]'>Welcome, lets connect you!</p>
            </div>
        </div>

        <div className='flex items-center gap-8 phone:gap-6'>
            <div>
              <FaHeadset className='size-7 phone:size-6 small-phone:size-5' />
            </div>

            <div className='relative'>
              <span className='absolute pt-[2px] pb-[2px] pl-[3px] pr-[3px] phone:pt-[1px] phone:pb-[1px] bg-red-600 text-white flex items-center justify-center rounded-3xl phone:rounded-xl text-xs phone:text-[10px] font-medium top-[-10px] left-[6px]'>99+</span>
              <LuBell className='size-7 phone:size-6 small-phone:size-5' />
            </div>
        </div>
    </div>
  )
}

export default Navbar