
export async function buyAirtime(req, res){
    console.log('AIRTIME BODY', req.body)
    try {
        
    } catch (error) {
        console.log('UNABLE TO BUY AIRTIME', error)
        res.status(500).json({ success: false, data: error.message || 'Unable to buy airtime'})
    }
}