import axios from 'axios'
import ElectricityServicesProviderModel from '../../model/ElectricityServicesProvider.js'

export async function verifyElectricMeterNumber(req, res){
    try {
      const {electricCompany,userMeterNumber} = req.body
      const url = `${process.env.CK_URL}/APIVerifyElectricityV1.0.asp?UserID=${process.env.CK_USER_ID}&APIKey=${process.env.CK_API_KEY}&ElectricCompany=${electricCompany}&meterno=${userMeterNumber}`
      const verifyElectricMeterNumberResponse = await axios.post(`
        ${url}
      `)
        
      const name = verifyElectricMeterNumberResponse.data.customer_name

      console.log(verifyElectricMeterNumberResponse.data)
      if(verifyElectricMeterNumberResponse.data.customer_name !== ''){
        return res.status(200).json({ success: true, data: verifyElectricMeterNumberResponse.data.customer_name })
      } else{
        return res.status(200).json({ success: false, data: 'Invalid Name' })
      }
    } catch (error) {
        console.log('UNABLE TO VERIFY ELECTRIC-METER ACCOUNT', error)
      res.status(500)
    }
}

export async function buyElectricityBills(req, res) {
    console.log('ELECTRICITY', req.body)
    const { meterNumber, amount, slug, code, meterName, _id } = req.body
    try {
        
    } catch (error) {
        console.log('UNABLE TO BUY ELECTRICITY', error)
        res.status(500).json({ success: false, data:  error.message || 'unable to buy electricity'})
    }
}

export async function createNewElectricServiceProvider(req, res) {
    const { icon, name, bannner, bannerColor, code, slug } = req.body
    try {
        const newProvider = await ElectricityServicesProviderModel.create({
            icon, name, bannner, bannerColor, code, slug
        })

        res.status(201).json({ success: true, data: 'New Electric Services Provider Created' })
    } catch (error) {
        console.log('ERROR UNABLE TO CREATE ELECTRIC SERVICE PROVIDER', error)
        res.status(500).json({ success: false, data: error.message || 'Unable to create new electric service provider'})
    }
}

export async function editElectricServiceProvider(req, res) {
    const { _id, icon, name, banner, bannerColor, code, slug } = req.body
    try {
        const findServiceProvider = await ElectricityServicesProviderModel.findById({ _id: _id });
        if(!findServiceProvider){
            return res.status(404).json({ success: false, data: 'No Electric service provider with this id found'})
        }

        const updateService = await ElectricityServicesProviderModel.findByIdAndUpdate(
            _id,
            {
                $set: {
                    icon,
                    name,
                    banner,
                    bannerColor,
                    code,
                    slug
                }
            },
            { new: true }
        )
        
        res.status(200).json({ success: true, data: 'Electric Services Provider Updated' })
    } catch (error) {
        console.log('ERROR UNABLE TO CREATE ELECTRIC SERVICE PROVIDER', error)
        res.status(500).json({ success: false, data: error.message || 'Unable to create new electric service provider'})
    }
}

export async function fetchElectricServiceProvider(req, res) {
    const { id } = req.params
    try {
        let electricProvider
        if(id){
            electricProvider = await ElectricityServicesProviderModel.find()
        } else {
            electricProvider = await ElectricityServicesProviderModel.find({ active: true})
        }

        res.status(200).json({ success: true, data: electricProvider })
    } catch (error) {
        console.log('ERROR UNABLE TO CREATE ELECTRIC SERVICE PROVIDER', error)
        res.status(500).json({ success: false, data: error.message || 'Unable to create new electric service provider'})
    }
}

