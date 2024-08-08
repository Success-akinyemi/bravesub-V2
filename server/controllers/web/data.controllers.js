import DataPlansModel from "../../model/DataPlans.js"

export async function buyData(req, res){
    console.log('DATA BODY', req.body)
    const { networkCode, phoneNumber, dataCode, bundleDetails } = req.body
    //discountAllowed dataPrice
    try {
        const mobileRegex = /^(090|080|070)\d{8}$/;
        if (!mobileRegex.test(phoneNumber)) {
            return res.status(400).json({ success: false, data: 'Invalid phone number' });
        }
        const dataPlans = await DataPlansModel.find()
        const findExistingNetwork = dataPlans.filter(option => option.networkCode === networkCode);

        const findDataPlan = findExistingNetwork.filter(option => option.dataCode === dataCode);
        const dataPlan = findDataPlan[0]
        console.log('DATA', dataPlan)
        
    } catch (error) {
        console.log('UNABLE TO BUY DATA', error)
        res.status(500).json({ success: false, data: error.message || 'Unable to buy data'})
    }
}

export async function createDataPlans(req, res) {
    const { networkCode, networkName, dataCode, planName, planType, price, cashBack, validity, costPrice } = req.body;
    try {
        if (!networkCode || !networkName || !dataCode || !planName || !planType || !price || !validity || !costPrice) {
            return res.status(400).json({ success: false, data: 'All fields are required' });
        }

        // Find data plans based on network code
        const findAllData = await DataPlansModel.find({ networkCode: networkCode });

        // Ensure two data codes do not exist on the same network code
        const findExistingCode = findAllData.filter(option => option.dataCode === dataCode);

        if (findExistingCode.length > 0) {
            return res.status(400).json({ success: false, data: `${networkName} data plan with this code: ${dataCode} already exists` });
        }

        const newDataPlan = await DataPlansModel.create({
            networkCode, networkName, dataCode, planName, planType, price, cashBack, validity, costPrice
        });
        console.log(newDataPlan);
        return res.status(201).json({ success: true, data: `New data plan created for ${networkName}` });
    } catch (error) {
        console.log('UNABLE TO CREATE NEW DATA PLAN', error);
        return res.status(500).json({ success: false, data: error.message || 'Unable to create new data plan' });
    }
}

export async function updateDataPlans(req, res) {

    const { _id, networkCode, networkName, dataCode, planName, planType, price, cashBack, costPrice, validity } = req.body;
    try {
        const findDataPlan = await DataPlansModel.findById({ _id: _id });
        if(!findDataPlan){
            return res.status(404).json({ success: false, data: 'No data Plan with this id found'})
        }

        const updatedDataPlan = await DataPlansModel.findByIdAndUpdate(
            _id,
            {
                $set: {
                    networkCode,
                    networkName,
                    dataCode,
                    planName,
                    planType,
                    price,
                    costPrice,
                    cashBack,
                    validity
                }
            },
            { new: true }
        );
        console.log(updatedDataPlan);
        return res.status(200).json({ success: true, data: `${updatedDataPlan?.networkName} ${updatedDataPlan?.planName}${updatedDataPlan?.planType} has been updated successfully` });
    } catch (error) {
        console.log('UNABLE TO UPDATE DATA PLAN', error);
        return res.status(500).json({ success: false, data: error.message || 'Unable to create new data plan' });
    }
}

export async function deleteDataPlan(req, res){
    const { id } = req.body
    try {
        const deletDataPlan = await DataPlansModel.findByIdAndDelete({ _id: id })
        
        res.status(201).json({ success: false, data: 'Data Plan deleted successful '})
    } catch (error) {
        console.log('UNABLE TO DELETE DATA PLAN', error)
        res.status(500).json({ success: false, data: error.message || 'Unable to delete data plan'})
    }
}

export async function fetAllDataPlans(req, res){
    try {
        const fetchDataPlans = await DataPlansModel.find().select('-costPrice')

        res.status(200).json({ success: true, data: fetchDataPlans })
    } catch (error) {
        console.log('UNABLE TO FETCH ALL DATA PLANS FROM DB')
        res.status(500).json({ success: false, data: error.message || 'Unable to fetch data plans'})
    }
}

export async function adminFetAllDataPlans(req, res){
    try {
        const fetchDataPlans = await DataPlansModel.find()
        
        res.status(200).json({ success: true, data: fetchDataPlans })
    } catch (error) {
        console.log('UNABLE TO FETCH ALL DATA PLANS FROM DB')
        res.status(500).json({ success: false, data: error.message || 'Unable to fetch data plans'})
    }
}