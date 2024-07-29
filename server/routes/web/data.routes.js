import express from 'express'
import * as controllers from '../../controllers/web/data.controllers.js'
import { AdminProtect, Protect } from '../../middleware/auth.js'

const router = express.Router()

router.post('/buyData', Protect, controllers.buyData)

router.post('/createDataPlans', AdminProtect, controllers.createDataPlans)
router.post('/updateDataPlans', AdminProtect, controllers.updateDataPlans)
router.post('/deleteDataPlan', AdminProtect, controllers.deleteDataPlan)

//GET ROUTES
router.get('/fetAllDataPlans', Protect, controllers.fetAllDataPlans)
router.get('/adminFetAllDataPlans', AdminProtect, controllers.adminFetAllDataPlans)



//PUT ROUTES

export default router