import axios from 'axios'
import toast from 'react-hot-toast'

axios.defaults.baseURL = import.meta.env.VITE_SERVER_URL

export async function registerUser(formData){
    try {
        const res = await axios.post('/auth/register', formData, {withCredentials: true})
        if(res.data.success){
            return res.data
        }
    } catch (error) {
        const errorMsg = error.response.data.data || 'Unable to register User'
        toast.error(errorMsg)
        console.log('REGISTER ERROR', error)
    }
}

export async function loginUser(formData){
    try {
        const res = await axios.post('/auth/login', formData, {withCredentials: true})
        return res.data
    } catch (error) {
        const errorMsg = error.response.data.data || 'Unable to register User'
        toast.error(errorMsg)
        //console.log('EEEE', error)
    }
}

export async function verifyUser({ id, token}){
    try {
        const res = await axios.post(`/auth/${id}/verify/${token}`)
        if(res.data.success){
            toast.success('Email Verified')
            return res
        }
    } catch (error) {
        const errorMsg = error.response.data.data || 'Unable to Verify Account'
        toast.error(errorMsg)
        console.log('first', error)
    }
}

export async function forgotPassword(formData){
    try {
        const res = await axios.post('/auth/forgotPassword', formData, {withCredentials: true})
        //console.log('forgot password',res)
        if(res.data){
            return res.data
        }
    } catch (error) {
        const errorMsg = error.response.data.data || 'Unable to Proccess forgot password request'
        toast.error(errorMsg)
        //console.log('FORGOT PASSWORD', error)
    }
}

export async function resetPassword(formData){
    try {
        const res = await axios.post(`/auth/resetPassword/${formData.resetToken}`, formData, {withCredentials: true})
        //console.log('reset password',res)
        if(res.data){
            return res.data
        }
    } catch (error) {
        const errorMsg = error.response.data.data || 'Unable to Proccess forgot password request'
        toast.error(errorMsg)
        //console.log('RESET PASSWORD', error)
    }
}

export async function paystackFunding(formData){
    try {
        const res = await axios.post(`/funding/paystackFunding`, formData, {withCredentials: true})
        const url = res.data.authorizationUrl
        window.location.href = url

    } catch (error) {
        const errorMsg = error.response.data.data || 'Unable to Proccess Payment request'
        toast.error(errorMsg)
        //console.log('PAYMENT REQUEST', error)
    }
}

export async function verifyPaystackPayment({paymentReference}){
    try {
        const res = await axios.post(`/funding/verifyPaystackPayment`, {paymentReference}, {withCredentials: true})
        if(res.data.success){
            return res.data
        }

    } catch (error) {
        const errorMsg = error.response.data.data || 'Unable to Verify Payment request'
        toast.error(errorMsg)
        //console.log('PAYMENT REQUEST', error)
    }
}

export async function buyData(formData){
    try {
        const res = await axios.post('/data/buyData', formData, {withCredentials: true})
        //console.log('BUY DATA',res)
        if(res.data){
            return res.data
        }
    } catch (error) {
        const errorMsg = error.response.data.data || 'Unable to Proccess buy data request'
        toast.error(errorMsg)
        //console.log('BUY DATA', error)
    }
}

export async function buyAirtime(formData){
    try {
        const res = await axios.post('/airtime/buyAirtime', formData, {withCredentials: true})
        //console.log('BUY DATA',res)
        if(res.data){
            return res.data
        }
    } catch (error) {
        const errorMsg = error.response.data.data || 'Unable to Proccess buy data request'
        toast.error(errorMsg)
        //console.log('BUY DATA', error)
    }
}