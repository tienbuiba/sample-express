import express from 'express'
import { createUser } from '../controllers/user.controller.js'


const userRoute = express.Router()


userRoute.post('/api/v1/user-register', createUser)


export default userRoute;