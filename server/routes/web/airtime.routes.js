import express from 'express'
import * as controllers from '../../controllers/web/airtime.controllers.js'
import { Protect } from '../../middleware/auth.js'

const router = express.Router()

router.post('/buyAirtime', Protect, controllers.buyAirtime)


//PUT ROUTES

export default router