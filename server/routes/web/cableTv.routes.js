import express from 'express'
import * as controllers from '../../controllers/web/cableTv.controllers.js'
import { AdminProtect, Protect } from '../../middleware/auth.js'

const router = express.Router()

//POST ROUTES
router.post('/verifyCableTvSmartCard', Protect, controllers.verifyCableTvSmartCard)
router.post('/buyCableTv', Protect, controllers.buyCableTv)




//GET ROUTES



export default router