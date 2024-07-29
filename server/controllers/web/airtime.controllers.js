
export async function buyAirtime(req, res){
    const { networkCode, network, phoneNumber, airtimeValue } = req.body
    console.log('AIRTIME BODY', req.body)
    try {
        const mobileRegex = /^(090|080|070)\d{8}$/;
        
        if (!mobileRegex.test(phoneNumber)) {
            return res.status(400).json({ success: false, data: 'Invalid phone number' });
        }

    } catch (error) {
        console.log('UNABLE TO BUY AIRTIME', error)
        res.status(500).json({ success: false, data: error.message || 'Unable to buy airtime'})
    }
}