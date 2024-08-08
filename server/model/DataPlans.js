import mongoose from "mongoose";

const DataPlansSchema = new mongoose.Schema({
    networkCode: {
        type: Number,
        required: [true, 'Network Code is required']
    },
    networkName: {
        type: String,
        required: [true, 'Network Name is required']
    },
    dataCode: {
        type: String,
        required: [true, 'Data Code is required']
    },
    planName: {
        type: String,
        required: [true, 'Plan Name is required']
    },
    planType: {
        type: String,
        required: [true, 'Plan Type is required (MB or GB)']
    },
    price: {
        type: Number,
        required: [true, 'Price is required']
    },
    cashBack: {
        type: Number,
        default: 0
    },
    costPrice: {
        type: Number,
        required: [true, 'Cost price is required']
    },
    validity: {
        type: String,
        required: [true, 'Validity Period is required']
    }
},
{timestamps: true}
)

const DataPlansModel = mongoose.model('dataPlan', DataPlansSchema)
export default DataPlansModel