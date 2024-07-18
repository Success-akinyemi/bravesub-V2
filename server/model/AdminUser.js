import mongoose from "mongoose";
import bcryptjs from 'bcryptjs'

const AdminUserSchema = new mongoose.Schema({
    userId: {
        type: String,
        unique: [true, 'Admin alredy exist']
    },
    name: {
        type: String
    },
    email: {
        type: String,
    },
    passCode: {
        type: String
    },
    adminUserCode: {
        type: String,
        unique: [true, 'Admin User Code must be unique']
    },
    active: {
        type: Boolean,
        default: true,
    }
},
{withCredentials: true}
)

AdminUserSchema.pre('save', async function(next){
    if(!this.isModified('passCode')) {
        return next();
    };
  
    try {
        const salt = await bcryptjs.genSalt(10);
        this.passCode = await bcryptjs.hash(this.passCode, salt)
        next()
    } catch (error) {
        next(error)
    }
})

AdminUserSchema.methods.matchPassCode = async function(passCode){
    return await bcryptjs.compare(passCode, this.passCode)
}

AdminUserSchema.methods.getSignedToken = function(){
    return jsonwebtoken.sign({ id: this.userId, isAdmin: this.isAdmin}, process.env.JWT_SECRET, { expiresIn: process.env.JWT_EXPIRE})
}


const AdminUserModel = mongoose.model('AdminUser', AdminUserSchema)
export default AdminUserModel