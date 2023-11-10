import express from 'express'
import { changePassword, createUser, forgotPassword, getAllUser, getProfile, loginUser, onOffUserBlock, resetPassword, uploadAvatar } from '../controllers/user.controller.js'
import { verifyToken } from '../middlewares/authJwt.js'
import multer from 'multer';
import { storage } from '../middlewares/uploadFile.js';
import { validateLogin, validateRegister } from '../middlewares/validator.js';
import userService from '../services/user.service.js';

const userRoute = express.Router();
const upload = multer({ storage: storage })

// register user
userRoute.post('/api/v1/register', validateRegister, createUser)

// login user
userRoute.post('/api/v1/login', validateLogin, loginUser)

// OnOffBlockUser
userRoute.post('/api/v1/onOff-UserBlock', onOffUserBlock)

//getProfile
userRoute.get('/api/v1/profile', verifyToken, getProfile)

// getAllUser
userRoute.get('/api/v1/all-user', getAllUser)

// changePassword
userRoute.post('/api/v1/change-password', verifyToken, changePassword)

//updateAvatar
userRoute.put('/api/v1/user/update-avatar',
    [upload.single('file'), verifyToken],
    uploadAvatar)

// forgotPassword
userRoute.post('/api/v1/forgot-password', forgotPassword)


// reset password
userRoute.post('/api/v1/reset-password', verifyToken, resetPassword)

export default userRoute;

