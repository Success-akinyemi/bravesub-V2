import express from 'express'
import * as controllers from '../../controllers/web/auth.controllers.js'

const router = express.Router()

router.post('/register', controllers.register)
router.post('/login', controllers.login)
router.post('/forgotPassword', controllers.forgotPassword)
router.route('/:id/verify/:token').post(controllers.verifyNewUser)
router.route('/resetPassword/:resetToken').post(controllers.resetPassword)
router.get('/signout', controllers.signout)

//PUT ROUTES

export default router