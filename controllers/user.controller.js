import { ApiResponseCode } from "../constants/apiStatus.constant.js"
import { HttpStatus } from "../constants/httpStatus.constant.js"
import BaseException from "../exceptions/base.exception.js"
import jwt from "jsonwebtoken"
import bcrypt from 'bcryptjs'
import userService from "../services/user.service.js"
import 'dotenv/config'
import { validationResult } from "express-validator"

// Secret key cho JSON Web Token
const secretKey = 'mysecretkey';



export const createUser = async (req, res, next) => {

    try {
        const { firstName, lastName, email, phone, dateOfBirth, password, gender } = req.body

        const errors = validationResult(req);

        if (!errors.isEmpty()) {
            return res.status(HttpStatus.BAD_REQUEST).send({
                status: ApiResponseCode.INVALID_PARAM,
                message: 'Invalid params',
                error: errors.array(),
            });
        }
        // check email is used?
        await userService.findUserByEmail({email});

        return res.status(HttpStatus.BAD_REQUEST).send({
            code: ApiResponseCode.INVALID_PARAM,
            message: 'Email is already used! '
        })



    } catch (err) {
        if (err instanceof BaseException) {
            // Mã hóa mật khẩu trước khi lưu vào cơ sở dữ liệu
            const salt = bcrypt.genSaltSync(10);
            const hashedPassword = bcrypt.hashSync(password, salt);
            const newUser = new User({
                email: req.body.email,
                password: hashedPassword,
                firstName: req.body.firstName,
                lastName: req.body.lastName,
                phone: req.body.phone,
                dateOfBirth: req.body.dateOfBirth,
                gender: req.body.gender,
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