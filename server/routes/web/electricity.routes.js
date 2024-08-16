import express from 'express'
import * as controllers from '../../controllers/web/electricity.controllers.js'
import { AdminProtect, Protect } from '../../middleware/auth.js'

const router = express.Router()

//POST ROUTES
router.post('/verifyElectricMeterNumber', Protect, controllers.verifyElectricMeterNumber)
router.post('/buyElectricityBills', Protect, controllers.buyElectricityBills)
router.post('/createNewElectricServiceProvider', AdminProtect, controllers.createNewElectricServiceProvider)
router.post('/editElectricServiceProvider', AdminProtect, controllers.editElectricServiceProvider)


//GET ROUTES
router.get('/fetchElectricServiceProvider', Protect, controllers.fetchElectricServiceProvider)
router.get('/fetchElectricServiceProvider/:id', AdminProtect, controllers.fetchElectricServiceProvider)



export default router