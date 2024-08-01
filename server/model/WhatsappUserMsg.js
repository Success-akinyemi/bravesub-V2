import mongoose from "mongoose";

const WhatsappChatSchema = new mongoose.Schema({
    userId: {
        type: String,
        unique: [true, 'User with this number already exist']
    },
    history: {
        type: Array
    },
    createdAt:{
        type: Date,
        default: Date.now(),
        expires: 86400 //24Hour
    }
})

const WhatsappChatModel = mongoose.model('whatsappUserMsg', WhatsappChatSchema)
export default WhatsappChatModel