import UserModel from "../../model/User.js"

export const buyData = async({ userConfirm, planCode, networkCode, phoneNumber, userId }) => {
    try{

        return ``
    } catch (error){
        return `Failed Unable to buy data`
    }
}

export const buyAirtime = async({ userConfirm, airtimeAmount, phoneNumber, networkCode, userId }) => {
    try {
        
        return ``
    } catch (error) {
        return ``
    }
}

export const fundAccount = async({ userConfirm, amount, userId }) => {
    const user = await UserModel.findOne({ mobile: userId })
    try {
        const paymentUrl = `${process.env.CLIENT_URL}/whatsapp/payment?amount=${amount}&email=${user?.email}`
        return `Alright ${user.username} kindly click on the link '\n' ${paymentUrl} '\n' to make the payment of ${amount} to fund your account`
    } catch (error) {
        return `Sorry ${user.username}, unable to create a payment link`
    }
}