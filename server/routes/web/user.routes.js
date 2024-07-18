import express from 'express'
import * as controllers from '../../controllers/web/user.controllers.js'

const router = express.Router()

router.post('/getAllUsers', controllers.getAllUsers)




//PUT ROUTES

export default router