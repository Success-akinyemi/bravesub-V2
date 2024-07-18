import UserModel from "../../model/User.js"

export async function getAllUsers(req, res){
    try {
        const allUsers = await UserModel.find()

        res.status(200).json({ success: true, data: allUsers})
    } catch (error) {
        console.log('UNABLE TO GET ALL USERS', error)
        res.status(500).json({  })
    }
}