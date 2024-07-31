import express from 'express'
import * as controllers from '../../controllers/web/funding.controllers.js'

const router = express.Router()

router.post('/paystackFunding', controllers.fundAcct)
router.post('/paystackWebhook', controllers.paystackWebhook)
router.post('/verifyPaystackPayment', controllers.verifyPaystackPayment)

router.post('/paystackFundingWhatsapp', controllers.fundAcct)



//PUT ROUTES

export default router