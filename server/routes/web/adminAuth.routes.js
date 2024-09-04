import express from 'express'
import * as controllers from '../../controllers/web/adminAuth.controllers.js'
import { AdminProtect } from '../../middleware/auth.js'

const router = express.Router()

router.post('/MakeAdmin', AdminProtect, controllers.MakeAdmin)
router.post('/loginAdmin', controllers.loginAdmin)
router.post('/deleteAdmin', AdminProtect, controllers.deleteAdmin)


//GET ROUTES
router.get('/getAllAdmin', AdminProtect, controllers.getAllAdmin)





//PUT ROUTES

export default router