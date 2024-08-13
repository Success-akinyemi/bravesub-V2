import FootNav from "../Components/FootNav"
import Navbar from "../Components/Navbar"
import { useSelector } from 'react-redux';
import { airtimeNetworks } from "../data/airtime";
import LogoImg from '../assets/logo.png'
import Refer from '../assets/svg/refer.svg'
import {CopyToClipboard} from 'react-copy-to-clipboard';
import toast from "react-hot-toast";
import { useFetchReferres } from "../Helpers/fetch.hooks";

function Rewards() {
  const { currentUser } = useSelector((state) => state.braveSubUser);
  const user = currentUser?.data
  const { apiReferresData, isLoadingReferres } = useFetchReferres(user._id)
  const referrees = apiReferresData?.data

  const networks = airtimeNetworks

  const clicked = () => {
    toast.success('Link Copied')  
  }


  return (
    <div className="page flex flex-col">
        <Navbar />
        <div className="ml-auto flex items-center text-[14px] phone:text-[12px] font-semibold mb-4 bg-purple-200 p-1 rounded-md">
          <h3>Cash Point Balance:</h3>
          <span>{user?.cashPoint}</span>
        </div>
        <h1 className="text-main-color flex items-center gap-1 font-bold text-[15px] phone:text-[13px]">
          <img alt="logo" src={LogoImg} className="w-[20px]" />
          Enjoy Exclusive Rewards with Bravesub
        </h1>
        
        <div className="mt-8 phone:mb-[10rem]">
          <div>
            <h2 className="text-[15px] phone:text-[12px] font-bold">Enjoy instant cash back on every data purchase</h2>
            <div className="mt-1 w-full flex flex-col bg-white shadow-shadow p-3 rounded-xl">
              <span className="flex items-center gap-2 mt-2">
                {networks?.map((item) => (
                  <img key={item?.code} alt={item?.network} src={item?.icon} className="h-[20px] w-[20px]" />
                ))}
              </span>
              <span className="text-[14px] text-gray-700 phone:text-[11px] phone:font-semibold mt-3">Buy Data and get instant cash back to buy more. keep buying keep earning</span>
            </div>
          </div>

          <div className="mt-8">
            <h2 className="text-[15px] phone:text-[12px] font-bold">Enjoy instant cash back on every airtime purchase</h2>
            <div className="mt-1 w-full flex flex-col bg-white shadow-shadow p-3 rounded-xl">
              <span className="flex items-center gap-2 mt-2">
                {networks?.map((item) => (
                  <img key={item?.code} alt={item?.network} src={item?.icon} className="h-[20px] w-[20px]" />
                ))}
              </span>
              <span className="text-[14px] text-gray-700 phone:text-[11px] phone:font-semibold mt-3">Buy Airtime and get instant cash back to buy more. keep buying keep earning</span>
            </div>
          </div>

          <div className="mt-8">
            <h2 className="text-[15px] phone:text-[12px] font-bold">Refer and earn</h2>
            <div className="mt-1 w-full flex flex-col bg-white shadow-shadow p-3 rounded-xl">
              <span className="flex items-center gap-2 mt-2">
                  <img src={Refer} className="h-[20px] w-[20px]" />
              </span>
              <span className="text-[14px] text-gray-700 phone:text-[11px] phone:font-semibold mt-3">Refer your friends, family, loved ones, associates to join bravesub and enjoy life time referal bonus on every of their purchase</span>
              
              <div className="w-ful flex mt-6 items-center justify-center flex-col">
                <small className="w-full font-bold text-[13px]">Your Referral link:</small>
                <input type="text" className="bg-purple-300 border-0 rounded-sm text-[14px]" disabled value={user?.referralLink} />
                  <CopyToClipboard text={user.referralLink} onCopy={clicked} >
                        <div className="mt-2">
                            <span className='btn text-center rounded-md p-1'>Copy</span>
                        </div>
                  </CopyToClipboard>
              </div>
            </div>
          </div>

          <div className="mt-8">
            <h2 className="text-[15px] phone:text-[12px] font-bold">Your Referrals {referrees?.length ? referrees?.length : ''}</h2>
            <div className="mt-1 w-full flex flex-col bg-white shadow-shadow p-3 rounded-xl">
                {
                  isLoadingReferres ? (
                    <div className='flex w-full items-center justify-center '>
                      <div class="mt-[4rem] mb-[4rem] loading-spinner"></div>
                    </div>
                  ) : (
                    referrees?.map((item) => (
                      <div className="flex items-center justify-between phone:text-[14px] small-phone:text-[13px] border-b-2 p-1">
                        <span className="">{item?.name}</span>
                        <span className={`${item?.verified ? 'text-green-700' : 'text-red-700'} font-bold`}>{item?.verified ? 'Verified' : 'Not Verified'}</span>
                      </div>
                    ))
                  )
                }
            </div>
          </div>

        </div>

        <FootNav />
    </div>
  )
}

export default Rewards