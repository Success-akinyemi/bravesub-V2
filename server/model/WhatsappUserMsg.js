import mongoose from "mongoose";

const WhatsappChatSchema = new mongoose.Schema({
    userId: {
        type: String,
        unique: [true, 'User with this number already exist']
    },
    history: {
        type: Array
    }
})

const WhatsappChatModel = mongoose.model('whatsappUserMsg', WhatsappChatSchema)
export default WhatsappChatModel