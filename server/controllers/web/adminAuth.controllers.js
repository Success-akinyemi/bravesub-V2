import AdminUserModel from "../../model/AdminUser.js"

async function generateUniqueAdminUserCode(){
    let unique = false
    let adminUserCode = ''

    while(!unique){
        const randomCode = Math.floor(10000 + Math.random() * 90000)
        adminUserCode = randomCode

        const existingCode = await AdminUserModel.findOne({ adminUserCode })
        if(!existingCode){
            unique = true
        }
    }
}

export async function MakeAdmin(res, res){
    const { id, passCode } = req.body
    try {
        const findUser = await UserModel.findById({ _id: id })
        if(!findUser){
            return res.status(404).json({ success: false, data: 'User Not Found'})
        }

        if(passCode.length !== 4){
            return res.status(400).json({ success: false, data: 'Pass code lenght must be 4 digit'})
        }
        
        const adminUserCode = await generateUniqueAdminUserCode()

        const newAdmin = AdminUserModel.create({
            userId: id, passCode, name: `${findUser.firstName} ${findUser.lastName}`, email: findUser.email, adminUserCode
        })

        res.status(201).json({ success: true, data: `New User: (${newAdmin.name}) made admin`})
    } catch (error) {
        console.log('UNABLE TO MAKE ADMIN', error)
        res.status(500).json({ success: false, data:  error.message || 'Unable to make admin'})
    }
}

export async function loginAdmin(req, res){
    const { adminUserCode, passCode } = req.body
    try {
        const admin = AdminUserModel.findOne({ adminUserCode: adminUserCode }).select('+passCode')

        if(!admin){
            return res.status(404).json({ success: false, data: 'Invalid' })
        }
        if(admin.active === false){
            return res.status(403).json({ success: false, data: 'Account has been blocked contact Administratve' })
        }

        const isMatch = await admin.matchPassCode(passCode)

        if(!isMatch){
            return res.json(401).status({ success: false, data: 'Invalid Pass code'})
        }

        const token = admin.getSignedToken()
        const expiryDate = new Date(Date.now() + 10 * 60 * 60 * 1000)
        const { password: passCode, ...userData } = admin._doc

        res.cookie('bravesubAtoken', token, { httpOnly: true, expires: expiryDate, sameSite: 'None', secure: true } ).status(200).json({ success: true, token: token, data: {success: true, data: userData }})
    } catch (error) {
        console.log('UNABLE TO LOGIN ADMIN', error)
        res.status(500).json({ success: false, data: error.message || 'Unable to login admin' })
    }
}

export async function getAllAdmin(req, res){
    try {
        const allAdmin = await AdminUserModel.find()

        res.status(200).json({ success: true, data: allAdmin })
    } catch (error) {
        console.log('UNABLE TO GET ALL ADMIN', error)
        res.status(500).json({ success: false, data: error.message || 'Unable to get all admin'})
    }
}