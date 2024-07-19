import { useLocation } from "react-router-dom"
import AccountBalance from "../Components/AccountBalance"
import Announcement from "../Components/Announcement"
import Banner from "../Components/Banner"
import FootNav from "../Components/FootNav"
import Navbar from "../Components/Navbar"
import Services from "../Components/Services"
import TopHistroy from "../Components/TopHistroy"
import { useDispatch } from "react-redux"
import { signInSuccess } from "../Redux/user/userSlice"
import toast from "react-hot-toast"
import { verifyPaystackPayment } from "../Helpers/api"
import { useEffect } from "react"

function Dashboard() {
  const location = useLocation();
  const dispatch = useDispatch()

  useEffect(() => {
      const query = new URLSearchParams(location.search);
      const paymentReference = query.get('reference');
  
      if (paymentReference) {
        const postPaymentReference = async (reference) => {
          try {
            const res = await verifyPaystackPayment({ paymentReference: reference });
            //console.log('Server response:', res.data);
            if(res.success){
              toast.success('Account Funding Successful')
              dispatch(signInSuccess(res))
            }
          } catch (error) {
            console.error('Error posting payment reference:', error);
          }
        };
  
        postPaymentReference(paymentReference);
      }
    }, [location]);

  return (
    <div className="page">
        <Navbar />
        <Announcement text={'bravesub version 2 is coming out soon'} />
        <div className="mt-5 bg-white rounded-3xl overflow-hidden">
          <AccountBalance />
          <div className="pt-1 pb-1 pl-5 pr-5 flex text-[15px] small-phone:text-[12px] font-semibold">
            enjoy zero transaction fees on all deposits
          </div>
        </div>
        <div className="bg-white rounded-3xl mt-7">
          <TopHistroy />
        </div>
        <div className="bg-white rounded-3xl mt-7">
          <Services />
        </div>
        <div className="rounded-3xl mt-7 overflow-hidden mb-[10rem]">
          <Banner />
        </div>
        <FootNav />
    </div>
  )
}

export default Dashboard