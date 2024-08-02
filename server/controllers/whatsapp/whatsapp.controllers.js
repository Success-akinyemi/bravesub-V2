import UserModel from "../../model/User.js"

export const buyData = async({ userConfirm, planCode, networkCode, phoneNumber, userId }) => {
    try{

        return ``
    } catch (error){
        console.log('WHATSAPP ERROR (BUY DATA)', error)
        return `Failed Unable to buy data`
    }
}

export const buyAirtime = async({ userConfirm, airtimeAmount, phoneNumber, networkCode, userId }) => {
    try {
        
        return ``
    } catch (error) {
        console.log('WHATSAPP ERROR (BUY AIRTIME)', error)
        return ``
    }
}

export const fundAccount = async({ userConfirm, amount, userId }) => {
    const user = await UserModel.findOne({ mobile: userId })
    console.log('FUND ACCOUNT')
    try {
        const paymentUrl = `${process.env.CLIENT_URL}/whatsapp/payment?amount=${amount}&email=${user?.email}`
        return `Alright ${user.username} kindly click on the link '\n' ${paymentUrl} '\n' to make the payment of ${amount} to fund your account`
    } catch (error) {
        console.log('WHATSAPP ERROR (FUND ACCOUNT)', error)
        return `Sorry ${user.username}, unable to create a payment link`
    }
}

export const handleReferral = async({userConfirm, referreeId, userId}) => {
    const user = await UserModel.findOne({ mobile: userId })
    try {
        if(referreeId === user._id){
            return `Unfortunatley ${user.username}, you cannot refer yourself please share the link with others.`
        }
        const findReferrer = await UserModel.findById({ _id: referreeId })
        if(!findReferrer){
            return `Sorry ${user.username}, no user found with the id provided please re-confirm id`
        }
        findReferrer.referrals.push(user._id);
        await findReferrer.save();
        user.referredBy = findReferrer._id;
        await user.save();
        
        return `Great ${user.username}, you were referred by ${findReferrer.username} enjoy amazing cashbacks and bonus when you by Data, Airtime, Cable Tv Subscription and Pay Electric bills from me.`
    } catch (error) {
        console.log('WHATSAPP ERROR (REFERRED BY SOMEONE)', error)
        return `Sorry ${user.username}, unable to process the referral request`
    }
}