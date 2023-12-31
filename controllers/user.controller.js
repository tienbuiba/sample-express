import { ApiResponseCode } from "../constants/apiStatus.constant.js"
import { HttpStatus } from "../constants/httpStatus.constant.js"
import BaseException from "../exceptions/base.exception.js"
import jwt from "jsonwebtoken"
import bcrypt from 'bcryptjs'
import userService from "../services/user.service.js"
import 'dotenv/config';
import { validationResult } from "express-validator"
import User from "../models/user.models.js"
import nodemailer from "nodemailer"

const { hashSync, compareSync, genSaltSync } = bcrypt;
const { sign } = jwt;

// register user
export const createUser = async (req, res, next) => {
    const { firstName, lastName, email, phone, password, avatarUrl } = req.body

    try {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(HttpStatus.BAD_REQUEST).send({
                status: ApiResponseCode.INVALID_PARAM,
                message: 'Invalid params',
                error: errors.array(),
            });

        }
        // check email is used?
        await userService.findUserByEmail(email);

        return res.status(HttpStatus.BAD_REQUEST).send({
            code: ApiResponseCode.INVALID_PARAM,
            message: 'Email is already used! '
        })


    } catch (err) {
        if (err instanceof BaseException) {
            // Mã hóa mật khẩu trước khi lưu vào cơ sở dữ liệu
            const salt = genSaltSync(10);
            const hashedPassword = hashSync(password, salt);

            const newUser = new User({
                email: email,
                password: hashedPassword,
                firstName: firstName,
                lastName: lastName,
                phone: phone,
                avatarUrl: avatarUrl
            })

            let user = await userService.create(newUser)

            return res.status(HttpStatus.OK).send({
                code: ApiResponseCode.SUCCESS,
                message: 'User was registered successfully!',
                data: user
            })
        }

        return res.status(HttpStatus.INTERNAL_SERVER_ERROR).send({
            code: ApiResponseCode.OTHER_ERROR,
            message: err.message
        })
    }
}

// login user
export const loginUser = async (req, res, next) => {
    const { email, password } = req.body

    try {

        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(HttpStatus.BAD_REQUEST).send({
                status: ApiResponseCode.INVALID_PARAM,
                message: 'Invalid params',
                error: errors.array()
            })
        }
        // get user by email
        const user = await userService.findUserByEmail(email)

        if (user.isBlock === 1) {
            return res.status(HttpStatus.FORBIDDEN).send({
                status: ApiResponseCode.AUTH_ERROR,
                message: 'Your account is block!'
            })
        }

        const passwordIsValid = compareSync(password, user.password)

        if (!passwordIsValid) {
            return res.status(HttpStatus.UNAUTHORIZED).send({
                status: ApiResponseCode.AUTH_ERROR,
                message: 'Incorrect password!'
            })
        }

        const cusInfo = {
            id: user.id,
            firstName: user.firstName,
            lastName: user.lastName,
            phone: user.phone,
            email: user.email,
        }

        // Tạo JSON Web Token, sign token
        let token = sign(cusInfo, process.env.ACCESS_TOKEN_SECRET, {
            expiresIn: process.env.ACCESS_TOKEN_EXPIRATION
        });

        let refreshToken = sign(cusInfo, process.env.REFRESH_TOKEN_SECRET, {
            expiresIn: process.env.REFRESH_TOKEN_EXPIRATION
        })

        return res.status(HttpStatus.OK).send({
            status: ApiResponseCode.SUCCESS,
            message: 'Login successfully!',
            data: {
                token: token,
                tokenExpire: parseInt(process.env.ACCESS_TOKEN_EXPIRATION),
                refreshToken: refreshToken,
                refreshTokenExpire: parseInt(process.env.REFRESH_TOKEN_EXPIRATION)
            }
        })

    } catch (err) {
        if (err instanceof BaseException) {
            return res.status(err.httpStatus).send({
                status: err.apiStatus,
                message: 'Email is not exist. Try again...'
            })
        }

        return res.status(HttpStatus.INTERNAL_SERVER_ERROR).send({
            status: ApiResponseCode.OTHER_ERROR,
            message: err.message
        })

    }

}

// onOffUserBlock
export const onOffUserBlock = async (req, res, next) => {

    const { email } = req.body

    try {
        let state = parseInt(req.query.isBlock)

        if (state !== 1 && state !== 0) {
            return res.status(HttpStatus.BAD_REQUEST).send({
                status: ApiResponseCode.INVALID_PARAM,
                message: 'Invalid state request'
            })

        }

        const blockUser = await userService.onOffUserBlock(email, state)

        return res.status(HttpStatus.OK).send({
            status: ApiResponseCode.SUCCESS,
            message: `${state === 0 ? 'unlock' : 'lock'} user successfully!`,
            data: {
                user: blockUser
            }
        })

    } catch (err) {
        if (err instanceof BaseException) {
            return res.status(err.httpStatus).send({
                status: err.apiStatus,
                message: err.message
            })
        }
        return res.status(HttpStatus.INTERNAL_SERVER_ERROR).send({
            status: ApiResponseCode.OTHER_ERROR,
            message: err.message
        })
    }

}

// getProfile
export const getProfile = async (req, res, next) => {
    const userId = req.userId

    try {
        const user = await userService.findUserById(userId);
        // Xóa thuộc tính password khỏi đối tượng user
        user.password = ''
        return res.status(HttpStatus.OK).send({
            status: ApiResponseCode.SUCCESS,
            message: 'Get user profile successfully!',
            data: user
        })

    } catch (err) {
        if (err instanceof BaseException) {
            return res.status(err.httpStatus).send({
                status: err.apiStatus,
                message: err.message
            })
        }
        return res.status(HttpStatus.INTERNAL_SERVER_ERROR).send({
            status: ApiResponseCode.OTHER_ERROR,
            message: err.message
        })

    }
}

// getAll user
export const getAllUser = async (req, res, next) => {

    try {
        let user = await User.find()
            .select('-password')
        // loại bỏ password

        let message
        if (!user) {
            message = "Empty message"
        } else {
            message = "Success"
        }

        return res.status(HttpStatus.OK).send({
            status: ApiResponseCode.SUCCESS,
            message: message,
            data: user
        })

    } catch (err) {

        if (err instanceof BaseException) {
            return res.status(err.httpStatus).send({
                status: err.apiStatus,
                message: err.message
            })
        }

        return res.status(HttpStatus.INTERNAL_SERVER_ERROR).send({
            status: ApiResponseCode.OTHER_ERROR,
            message: err.message
        })

    }

}

// changePassword
export const changePassword = async (req, res, next) => {

    try {
        const userId = req.userId
        const { oldPassword, newPassword } = req.body

        const data = await userService.findUserById(userId)
        const passwordIsValid = compareSync(oldPassword, data.password)

        if (!passwordIsValid) {
            return res.status(HttpStatus.UNAUTHORIZED).send({
                status: ApiResponseCode.AUTH_ERROR,
                message: 'Incorrect password!'
            })
        }

        // Mã hóa mật khẩu trước khi lưu vào cơ sở dữ liệu
        const salt = genSaltSync(10);
        const hashedPassword = hashSync(newPassword, salt);

        await userService.changePassword(userId, hashedPassword)

        return res.status(HttpStatus.OK).send({
            status: ApiResponseCode.SUCCESS,
            message: 'Change password successfully!',
        })

    } catch (err) {
        if (err instanceof BaseException) {

            return res.status(err.httpStatus).send({
                status: err.apiStatus,
                message: err.message
            })

        }

        return res.status(HttpStatus.INTERNAL_SERVER_ERROR).send({
            status: ApiResponseCode.OTHER_ERROR,
            message: err.message
        })

    }

}

//upload avatar
export const uploadAvatar = async (req, res, next) => {

    try {

        const file = req.file;
        const userId = req.userId;

        if (!file) {
            return res.status(HttpStatus.BAD_REQUEST).send({
                status: ApiResponseCode.INVALID_PARAM,
                message: 'Please upload file!',
            });
        }

        //check file extensions

        if (!file.mimetype.startsWith("image/")) {
            return res.status(HttpStatus.BAD_REQUEST).send({
                status: ApiResponseCode.INVALID_PARAM,
                message: "Only support image file!"
            })
        }

        const avtUrl = `${process.env.IMAGE_PRE_PATH}/${req.file.filename}`

        const updateUser = await userService.updateAvatar(avtUrl, userId)

        return res.status(HttpStatus.OK).send({
            status: ApiResponseCode.SUCCESS,
            message: 'update avatar successfully',
            data: updateUser,
        });

    } catch (err) {
        if (err instanceof BaseException) {
            return res.status(err.httpStatus).send({
                status: err.apiStatus,
                message: err.message
            })
        }
        return res.status(HttpStatus.INTERNAL_SERVER_ERROR).send({
            status: ApiResponseCode.OTHER_ERROR,
            message: err.message
        })
    }
}

//forgotPassword



export const forgotPassword = async (req, res, next) => {

    try {
        // Replace with your own email configuration
        const emailConfig = {
            service: 'Gmail',
            auth: {
                user: 'tienbuiba2408@gmail.com',
                pass: 'ehcm dyes uqro ekwb'
            }
        };

        const transporter = nodemailer.createTransport(emailConfig);
        const { email } = req.body;
        // get user by email
        const user = await userService.findUserByEmail(email)

        if (!user) {
            throw new BaseException(
                HttpStatus.NOT_FOUND, ApiResponseCode.DATABASE_ERROR,
                `User not found width email ${email}`
            )
        }

        const cusInfo = {
            id: user.id,
            firstName: user.firstName,
            lastName: user.lastName,
            phone: user.phone,
            email: user.email,
        }

        // Tạo JSON Web Token, sign token
        let token = sign(cusInfo, process.env.ACCESS_TOKEN_SECRET, {
            expiresIn: process.env.RESET_PASSWORD
        });

        // Construct the reset link
        const resetLink = `http://localhost/reset-password?token=${token}`;

        // Send the reset link to the user's email
        const mailOptions = {
            from: 'TIENBB',
            to: email,
            subject: 'Password Reset',
            text: `Click the following link to reset your password: ${resetLink}`,
        }

        transporter.sendMail(mailOptions, (error, info) => {

            if (error) {
                console.error('Error sending email:', error);
                return res.status(500).json({ message: 'Failed to send reset email' });
            } else {
                console.log('Reset email sent:', info.response);
                return res.status(200).json({ message: 'Reset email sent successfully' });
            }
        })

    } catch (err) {
        if (err instanceof BaseException) {
            return res.status(err.httpStatus).send({
                status: err.apiStatus,
                message: err.message
            })
        }
        return res.status(HttpStatus.INTERNAL_SERVER_ERROR).send({
            status: ApiResponseCode.OTHER_ERROR,
            message: err.message
        })
    }
}


export const resetPassword = async (req, res, next) => {
    try {

        const userId= req.userId
        const { newPassword}= req.body

        // Mã hóa mật khẩu trước khi lưu vào cơ sở dư liệu
        const salt = genSaltSync(10);
        const hashedPassword= hashSync(newPassword, salt);
        await userService.changePassword(userId, hashedPassword)

        return res.status(HttpStatus.OK).send({
            status: ApiResponseCode.SUCCESS,
            message: 'Reset Password successfully!'
        })

        
    } catch (err) {
        if( err instanceof BaseException){
            return res.sattus(err.httpStatus).send({
                status: ApiResponseCode.OTHER_ERROR,
                message: err.message
            })
        }
        return res.status(HttpStatus.INTERNAL_SERVER_ERROR).send({
            status: ApiResponseCode.OTHER_ERROR,
            message: err.message
        })
    }

}