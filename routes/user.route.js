import express from 'express'
import { createUser, getProfile, loginUser, onOffUserBlock } from '../controllers/user.controller.js'
import { verifyToken } from '../middlewares/authJwt.js'


const userRoute = express.Router()

// register user
userRoute.post('/api/v1/register', createUser)

// login user
userRoute.post('/api/v1/login', loginUser)

// OnOffBlockUser
userRoute.post('/api/v1/onOff-UserBlock', onOffUserBlock)

//getProfile
userRoute.get('/api/v1/profile', verifyToken, getProfile)

export default userRoute;