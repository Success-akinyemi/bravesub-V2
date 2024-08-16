export async function verifyCableTvSmartCard(req, res){
    try {
      const {smartCardNumber,cableTvCode} = req.body

      const verifySmartCardResponse = await axios.post(`
      ${process.env.CK_URL}/APIVerifyCableTVV1.0.asp?UserID=${process.env.CK_USER_ID}&APIKey=${process.env.CK_API_KEY}&cabletv=${cableTvCode}&smartcardno=${smartCardNumber}
      `)
  
      console.log(verifySmartCardResponse.data)

      const name = verifySmartCardResponse.data.customer_name

      console.log(verifySmartCardResponse.data)
      if(verifySmartCardResponse.data.customer_name !== ''){
        return res.status(200).json({ success: true, data: verifySmartCardResponse.data.customer_name })
      } else{
        return res.status(200).json({ success: false, data: 'Invalid Name' })
      }
    } catch (error) {
        console.log('UNABLE TO VERIFY CABLE-TV ACCOUNT', error)
      res.status(500)
    }
  }

  export async function buyCableTv(req, res){
    console.log(req.body)
    try {

    } catch (error) {
      console.log('UNABLE TO BUY CABLE-TV SUB', error)
      res.status(500).json({ success: false, data: error.message || 'unable to subscribe'})
    }
  }
  
  