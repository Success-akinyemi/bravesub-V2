import express from 'express'
import * as controllers from '../../controllers/web/adminAuth.controllers.js'

const router = express.Router()

router.post('/MakeAdmin', controllers.MakeAdmin)
router.post('/loginAdmin', controllers.loginAdmin)
router.post('/deleteAdmin', controllers.deleteAdmin)


//GET ROUTES
router.get('/getAllAdmin', controllers.getAllAdmin)





//PUT ROUTES

export default router