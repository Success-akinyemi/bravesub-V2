import './App.css'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import Dashboard from './Pages/Dashboard'
import Data from './Pages/Data'
import Airtime from './Pages/Airtime'
import Rewards from './Pages/Rewards'
import Profile from './Pages/Profile'
import Funding from './Pages/Funding'
import Register from './Pages/Authorization/Register'
import Login from './Pages/Authorization/Login'
import { useEffect, useState } from 'react'
import AirtimePayment from './Components/Modal/AirtimePayment'
import DataPayment from './Components/Modal/DataPayment'
import { Toaster } from 'react-hot-toast'
import EmailVerification from './Pages/Authorization/EmailVerification'
import ForgotPassword from './Pages/Authorization/ForgotPassword'
import VerifyUser from './Pages/Authorization/VerifyUser'
import ResetEmailSent from './Pages/Authorization/ResetEmailSent'
import ResetPassword from './Pages/Authorization/ResetPassword'
import { AuthorizeAdmin, AuthorizeUser } from './Auth/ProtectRoute'
import AdminLogin from './Admin/AdminLogin'
import AdminDashboard from './Admin/AdminDashboard'
import Users from './Admin/Users'
import ViewUser from './Admin/Modal/ViewUser'
import DataPlans from './Admin/DataPlans'
import EditDataPlan from './Admin/Modal/EditDataPlan'
import WhatsappPayment from './Pages/WhatsappPayment'
import WhatsappVerifyPayment from './Pages/WhatsappVerifyPayment'
import Electricity from './Pages/Electricity'
import Tv from './Pages/Tv'
import ElectricServiceProviders from './Components/Helpers/ElectricServiceProviders'
import TvServiceProviders from './Components/Helpers/TvServiceProviders'
import { accountType, electricityProviders } from './data/electricity'
import ElectricMeterType from './Components/Helpers/ElectricMeterType'


function App() {
  const [ selectedCard, setSelectedCard ] = useState(null)
  const [ formData, setFormData ] = useState({})

  const [ providerName, setProviderName ] = useState('')
  const [ providerIcon, setProviderIcon ] = useState('')
  const [ meterType, setMeterType ] = useState('')

  const electricityServices = electricityProviders
  const electricityAccount = accountType
  
  useEffect(() => {
      setProviderName(electricityServices[0].name)
      setProviderIcon(electricityServices[0].icon)
      setMeterType(electricityAccount[0].type)
  }, [electricityServices, electricityAccount])

  const renderPopup = () => {
    switch(selectedCard){
      case 'airtimePopup' : 
        return (
          <div>
            <AirtimePayment formData={formData} setFormData={setFormData} />
          </div>
        )
      case 'dataPopup':
        return (
          <div>
            <DataPayment formData={formData} setFormData={setFormData} />
          </div>
        )
      case 'viewUser':
        return (
          <div>
            <ViewUser formData={formData} setFormData={setFormData} />            
          </div>
        )
      case 'editDataPlans':
        return (
          <div>
            <EditDataPlan formData={formData} setFormData={setFormData} />            
          </div>
        )
      case 'payElectricBilsModal':
        return (
          <div>
              <payElectricBilsModal formData={formData} setFormData={setFormData} />  
          </div>
        )
    }
  }

  const closePopup = () => {
    setSelectedCard(null)
  }

  return (
    <div className='app'>
      <Toaster position='top-center' reverseOrder={false}></Toaster>
      <BrowserRouter>
      {
        selectedCard && (
        <div className='fixed w-[100vw] h-[100vh] top-0 left-0 bg-black bg-opacity-80 z-50 overflow-x-hidden'>
          <div className={`bg-main-bg w-full absolute flex flex-col bottom-0 left-0 ${selectedCard === 'electricMeterType' ? 'h-[50vh]' : 'h-[80vh] phone:h-[85vh] small-phone:h-[95vh]' } rounded-tl-[4rem] rounded-tr-[4rem] pl-6 pr-6 pt-4 pb-4`}>
            <span onClick={closePopup} className='text-[40px] small-phone:text-[35px] font-extralight border-[3px] text-gray-600 cursor-pointer rounded-full border-gray-600 h-[40px] w-[40px] small-phone:h-[35px] small-phone:w-[35px] flex items-center justify-center ml-auto'>&times;</span>
            <div className='h-full relative'>
              {
                selectedCard === 'electricServiceProviders' ? <ElectricServiceProviders setFormData={setFormData} formData={formData} setSelectedCard={setSelectedCard} setProviderIcon={setProviderIcon} setProviderName={setProviderName} /> : 
                selectedCard === 'tvServiceProviders' ? <TvServiceProviders setFormData={setFormData} setSelectedCard={setSelectedCard} /> :
                selectedCard === 'electricMeterType' ? <ElectricMeterType setFormData={setFormData} formData={formData} setSelectedCard={setSelectedCard} setMeterType={setMeterType} /> :
                renderPopup()
              }
            </div>
          </div>
        </div>
        )
      }
        <Routes>
          <Route path='/' element={<Login formData={formData} setformData={setFormData} />} />
          <Route path='/register' element={<Register formData={formData} setformData={setFormData} />} />
          <Route path='/login' element={<Login formData={formData} setformData={setFormData} />} />
          <Route path='/email-verification' element={<EmailVerification />} />
          <Route path='/forgot-password' element={<ForgotPassword formData={formData} setformData={setFormData} />} />
          <Route path='/:id/verify/:token' element={<VerifyUser />} />
          <Route path='/reset-email-sent' element={<ResetEmailSent />} />
          <Route path='/reset-password/:resetToken' element={<ResetPassword formData={formData} setformData={setFormData} />} />

          <Route path='/whatsapp/payment' element={<WhatsappPayment formData={formData} setformData={setFormData} />} />
          <Route path='/whatsapp/verifyPayment' element={<WhatsappVerifyPayment />} />


          <Route element={<AuthorizeUser />}>
            <Route path='/dashboard' element={<Dashboard />} />
          </Route>
          <Route element={<AuthorizeUser />}>
            <Route path='/data' element={<Data formData={formData} setformData={setFormData} setSelectedCard={setSelectedCard} />} />
          </Route>
          <Route element={<AuthorizeUser />}>
            <Route path='/airtime' element={<Airtime formData={formData} setformData={setFormData} setSelectedCard={setSelectedCard} />} />
          </Route>
          <Route element={<AuthorizeUser />}>
            <Route path='/electricity' element={<Electricity formData={formData} setformData={setFormData} setSelectedCard={setSelectedCard} providerIcon={providerIcon} providerName={providerName} meterType={meterType} />} />
          </Route>
          <Route element={<AuthorizeUser />}>
            <Route path='/tv' element={<Tv formData={formData} setformData={setFormData} setSelectedCard={setSelectedCard} />} />
          </Route>
          <Route element={<AuthorizeUser />}>
          <Route path='/refer-and-earn' element={<Rewards />} />
          </Route>
          <Route element={<AuthorizeUser />}>
            <Route path='/profile' element={<Profile formData={formData} setFormData={setFormData} />} />
          </Route>
          <Route element={<AuthorizeUser />}>
            <Route path='funding' element={<Funding formData={formData} setformData={setFormData} />} />
          </Route>

          //ADMIN
          <Route path='admin-login' element={<AdminLogin formData={formData} setformData={setFormData} />} />
          <Route element={<AuthorizeAdmin />}>
            <Route path='/users' element={<Users setSelectedCard={setSelectedCard} setFormData={setFormData} />} />
          </Route>
          <Route element={<AuthorizeAdmin />}>
            <Route path='admin-dashboard' element={<AdminDashboard formData={formData} setformData={setFormData} />} />
          </Route>
          <Route element={<AuthorizeAdmin />}>
            <Route path='/data-plans' element={<DataPlans setSelectedCard={setSelectedCard} setformData={setFormData} formData={formData} />} />
          </Route>


        </Routes>
      </BrowserRouter>
    </div>
  )
}

export default App