import mongoose from "mongoose";
import crypto from 'crypto'
import bcryptjs from 'bcryptjs'
import jsonwebtoken from 'jsonwebtoken'
import { type } from "os";

export const UserSchema = new mongoose.Schema({
    username: {
        type: String, 
        required: [true, "Please provide a user name"]
    },
    password: {
        type: String,
        required: [true, "Please provide a password"]
    },
    email: {
        type: String,
        //required: [true, "please Provide a valid email"],
        unique: [true, "Email already exist"]
    },
    firstName: { type: String },
    lastName: { type: String },
    mobile: { type: String},
    whatsappNumber: { type: String},
    profile: { 
        type: String,
        default: 'https://firebasestorage.googleapis.com/v0/b/success-clone.appspot.com/o/user_1177568.png?alt=media&token=3c4010b0-526b-4f76-ae30-d0e74d76716e'
    },
    country: { type: String },
    city: { type: String},
    state: { type: String },
    dob: Date,
    acctBalance: {
        type: Number, 
        default: 0,
    },
    cashPoint: {
        type: Number, 
        default: 0,
    },
    transactionTotal: {
        type: Number,
        default: 0,
    },
    referralLink: {
        type: String
    },
    whatsappReferralLink: {
        type: String
    },
    referredBy: {
        type: String
    },
    referrals: {
        type: Array
    },
    referredBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'bravesubUsers'
    },
    verified: {
        type: Boolean,
        default: false
    },
    blocked: {
        type: Boolean,
        default: false
    },
    createdSource: {
        type: String
    },
    resetPasswordToken: String,
    resetPasswordExpire: Date,
},
{minimize: false},
{timestamps: true}
);

UserSchema.pre('save', async function(next){
    if(!this.isModified('password')) {
        return next();
    };
  
    try {
        const salt = await bcryptjs.genSalt(10);
        this.password = await bcryptjs.hash(this.password, salt)
        next()
    } catch (error) {
        next(error)
    }
})

UserSchema.methods.matchPasswords = async function(password){
    return await bcryptjs.compare(password, this.password)
}

UserSchema.methods.getSignedToken = function(){
    return jsonwebtoken.sign({ id: this._id, isAdmin: this.isAdmin}, process.env.JWT_SECRET, { expiresIn: process.env.JWT_EXPIRE})
}

UserSchema.methods.getResetPasswordToken = function(){
    const resetToken = crypto.randomBytes(20).toString('hex');

    this.resetPasswordToken = crypto.createHash('sha256').update(resetToken).digest('hex')
    this.resetPasswordExpire = Date.now() + 10 * (60 * 1000)

    return resetToken
}


const UserModel =  mongoose.model('bravesubUser', UserSchema);
export default UserModel