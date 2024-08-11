import UserModel from "../../model/User.js"

export async function getAllUsers(req, res){
    try {
        const allUsers = await UserModel.find().select('-password');

        res.status(200).json({ success: true, data: allUsers})
    } catch (error) {
        console.log('UNABLE TO GET ALL USERS', error)
        res.status(500).json({ success: false, data: error.message || 'Uanble to get all users' })
    }
}
  
export async function adminUpdateUser(req, res){
    const { cashPoint, blocked, _id, username, firstName, lastName, mobile, email, acctBalance, referralLink, transactionTotal, whatsappNumber } = req.body
    try {
        const findUser = await UserModel.findById({ _id: _id });
        if(!findUser){
            return res.status(404).json({ success: false, data: 'No user with this id found'})
        }

        const updateUser = await UserModel.findByIdAndUpdate(
            _id,
            {
                $set: {
                    email,
                    cashPoint,
                    blocked,
                    username,
                    firstName,
                    lastName,
                    mobile,
                    acctBalance,
                    referralLink,
                    transactionTotal,
                    whatsappNumber
                }
            },
            { new: true }
        );
        return res.status(200).json({ success: true, data: `User Info Updated` });
    } catch (error) {
        console.log('UNABLE TO UPDATE USER DATA', error);
        return res.status(500).json({ success: false, data: error.message || 'Unable to update user data' });
    }
}

export async function updateUser(req, res){
    const { _id, username, firstName, lastName, mobile, email, whatsappNumber } = req.body
    try {
        const findUser = await UserModel.findById({ _id: _id });
        if(!findUser){
            return res.status(404).json({ success: false, data: 'No user with this id found'})
        }

        const updateUser = await UserModel.findByIdAndUpdate(
            _id,
            {
                $set: {
                    username,
                    firstName,
                    lastName,
                    mobile,
                    email,
                    whatsappNumber
                }
            },
            { new: true }
        );
        const { resetPasswordToken, resetPasswordExpire, password: hashedPassword, ...userData } = updateUser._doc
        return res.status(200).json({ success: true, data: {success: true, data: userData} });
    } catch (error) {
        console.log('UNABLE TO UPDATE USER DATA', error);
        return res.status(500).json({ success: false, data: error.message || 'Unable to update user data' });
    }
}

export async function getAllUserReferrees(req, res){
    const { id } = req.params
    console.log(' WORKING')
    try {
        const user = await UserModel.findById({ _id : id })

        const referrees = user.referrals
        console.log('first', referrees)

        const referredUsers = [];

        for(const reerreeId of referrees){
            const referree = await UserModel.findById({ _id: reerreeId })

            if(referree){
                referredUsers.push({
                    _id: referree._id,
                    username: referree.username,
                    email: referree.email,
                    verified: referree.verified,
                    name: `${referree.firstName} ${referree.lastName}`
                })
            }
        }

        console.log('referredUsers', referredUsers)
        res.status(200).json({ success: true, data: referredUsers})

    } catch (error) {
        console.log('COULD NOT GET ALL REFERRED USERS', error)
        res.status(500).json({ success: false, data: 'Could not get reerred Users'})
    }
}


//DANGER
export async function deleteUser(req, res) {
    const { id } = req.body
    try {
        const getUser = await UserModel.findById({ _id: id})
        if(!getUser){
            return res.status(404).json({ success: false, data: 'User with this id not found'})
        }
        const deleteUser = await UserModel.findByIdAndDelete({ _id: id})

        res.status(201).json({ success: true, data: 'User deleted Successful' })
    } catch (error) {
        console.log('UNABLE TO DELETE USER>>', error)
        res.status(500).json({ success: false, data: error.message || 'unable to delete user'})
    }
}