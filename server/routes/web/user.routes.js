import express from 'express'
import * as controllers from '../../controllers/web/user.controllers.js'
import { AdminProtect, Protect } from '../../middleware/auth.js'

const router = express.Router()

//POST ROUTES
router.post('/adminUpdateUser', AdminProtect, controllers.adminUpdateUser)
router.post('/updateUser', Protect, controllers.updateUser)





//GET USERS
router.get('/getAllUsers', AdminProtect, controllers.getAllUsers)
router.get('/getAllUserReferrees/:id', Protect, controllers.getAllUserReferrees)





//PUT ROUTES

export default router