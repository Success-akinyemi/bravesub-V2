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
import { useState } from 'react'
import AirtimePayment from './Components/Modal/AirtimePayment'
import DataPayment from './Components/Modal/DataPayment'
import { Toaster } from 'react-hot-toast'
import EmailVerification from './Pages/Authorization/EmailVerification'
import ForgotPassword from './Pages/Authorization/ForgotPassword'
import VerifyUser from './Pages/Authorization/VerifyUser'
import ResetEmailSent from './Pages/Authorization/ResetEmailSent'
import ResetPassword from './Pages/Authorization/ResetPassword'
import { AuthorizeUser } from './Auth/ProtectRoute'


function App() {
  const [ selectedCard, setSelectedCard ] = useState(null)
  const [ formData, setFormData ] = useState({})

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
          <div className='bg-main-bg w-full absolute flex flex-col bottom-0 left-0 h-[80vh] phone:h-[85vh] rounded-tl-[4rem] rounded-tr-[4rem] pl-6 pr-6 pt-4 pb-4'>
            <span onClick={closePopup} className='text-[40px] font-extralight border-[3px] text-gray-600 cursor-pointer rounded-full border-gray-600 h-[40px] w-[40px] flex items-center justify-center ml-auto'>&times;</span>
            <div className='h-full relative'>
              {renderPopup()}
            </div>
          </div>
        </div>
        )
      }
        <Routes>
          <Route path='/register' element={<Register formData={formData} setformData={setFormData} />} />
          <Route path='/login' element={<Login formData={formData} setformData={setFormData} />} />
          <Route path='/email-verification' element={<EmailVerification />} />
          <Route path='/forgot-password' element={<ForgotPassword formData={formData} setformData={setFormData} />} />
          <Route path='/:id/verify/:token' element={<VerifyUser />} />
          <Route path='/reset-email-sent' element={<ResetEmailSent />} />
          <Route path='/reset-password/:resetToken' element={<ResetPassword formData={formData} setformData={setFormData} />} />

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
          <Route path='/refer-and-earn' element={<Rewards />} />
          </Route>
          <Route element={<AuthorizeUser />}>
            <Route path='/profile' element={<Profile />} />
          </Route>
          <Route element={<AuthorizeUser />}>
            <Route path='funding' element={<Funding formData={formData} setformData={setFormData} />} />
          </Route>

        </Routes>
      </BrowserRouter>
    </div>
  )
}

export default App