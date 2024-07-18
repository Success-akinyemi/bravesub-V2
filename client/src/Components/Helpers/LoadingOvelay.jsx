import LogoImg from '../../assets/logo.png'

function LoadingOvelay() {
  return (
    <div className='fixed w-[100vw] h-[100vh] top-0 left-0 bg-black bg-opacity-80 z-[80] overflow-x-hidden flex items-center justify-center'>
        <div className='bg-white p-3 rounded-2xl flex flex-col items-center justify-center h-[150px] w-[150px] phone:h-[120px] phone:w-[120px]'>
            <img className='w-[80px] phone:w-[40px] rotate-3d' src={LogoImg} alt='logo' />
            <small className='mt-4 font-semibold text-[17px] phone:text-[14px] fadeText'>Please wait</small>
        </div>
    </div>
  )
}

export default LoadingOvelay
