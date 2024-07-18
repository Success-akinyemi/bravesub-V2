import mongoose, { Schema } from "mongoose";

export const TransactionSchema = new mongoose.Schema(
    {
        userId: {
            type: String,
        },
        transactionId:{
            type: String,
        },
        transcationType: {
            type: String,
            required: [true, 'transaction type isrequired'],
        },
        email: {
            type: String,
            required: [true, 'email is required'],
        },
        amount: {
            type: Number,
            required: [true, 'amount is required'],
        },
        transcationDesc:{
            type: String
        },
        transcationStatus: {
            type: String,
            default: 'Pending'
        },
        credit: {
            type: Boolean
        }
    },
    {
        timestamps: true
    }
);


const TransactionModel =  mongoose.model('bravesubTransactionDetails', TransactionSchema);
export default TransactionModel