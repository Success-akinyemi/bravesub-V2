import express from 'express'
import * as controllers from '../../controllers/web/adminAuth.controllers.js'

const router = express.Router()

router.post('/MakeAdmin', controllers.MakeAdmin)
router.post('/loginAdmin', controllers.loginAdmin)

//GET ROUTES
router.post('/getAllAdmin', controllers.getAllAdmin)





//PUT ROUTES

export default router