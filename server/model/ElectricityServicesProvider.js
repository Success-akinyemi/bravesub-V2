import mongoose from "mongoose";

const ElectricityServicesProviderSchema = new mongoose.Schema({
    icon: {
        type: String,
    },
    name: {
        type: String,
        required: [true, 'provide a service provider name'],
        unique: [true, 'service provider with this name already exist']
    },
    banner: {
        type: String
    },
    bannerColor: {
        type: String,
    },
    code: {
        type: String,
        required: [true, 'services provider code is required']
    },
    slug: {
        type: String
    },
    active: {
        type: Boolean,
        default: true
    }
},
{ timestamps: true }
)

const ElectricityServicesProviderModel = mongoose.model('ElectricityServicesProvider', ElectricityServicesProviderSchema)
export default ElectricityServicesProviderModel