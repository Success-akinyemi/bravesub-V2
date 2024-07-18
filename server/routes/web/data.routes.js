import express from 'express'
import * as controllers from '../../controllers/web/data.controllers.js'
import { Protect } from '../../middleware/auth.js'

const router = express.Router()

router.post('/buyData', Protect, controllers.buyData)

router.post('/createDataPlans', controllers.createDataPlans)
router.post('/updateDataPlans', controllers.updateDataPlans)
router.post('/deleteDataPlan', controllers.deleteDataPlan)

//GET ROUTES
router.get('/fetAllDataPlans', Protect, controllers.fetAllDataPlans)


//PUT ROUTES

export default router