import { ApiResponseCode } from "../constants/apiStatus.constant.js";
import { HttpStatus } from "../constants/httpStatus.constant.js";
import BaseException from "../exceptions/base.exception.js";
import User from "../models/user.models.js";

class UserService {

    async findOne(id) {
        const user = await User.findById(id);
        if (!user) {
            // throw new BaseException(
            //     HttpStatus.BAD_REQUEST, ApiResponseCode.INVALID_PARAM,
            //     `User not found with id ${id}`
            // )

            throw new Error(`User not found with id ${id}`);
        }
        return user;
    }

    async findUserByEmail(email) {

        const user = await User.findOne({
            email: email
        })

        if (!user) {
            throw new BaseException(HttpStatus.NOT_FOUND,
                ApiResponseCode.DATABASE_ERROR,
                `User not found with email is ${email}`)
        }
        return user
    }


    async findAll() {
        return await User.find()
    }

    async create(data) {

        const user = await User.create(data)
        return user;

    }

    async onOffUserBlock(email, state) {
        const user = await User.findOneAndUpdate({ email: email }, { isBlock: state }, { new: true })

        if (!user) {
            throw new BaseException(
                HttpStatus.NOT_FOUND,
                ApiResponseCode.DATABASE_ERROR,
                `User not found with email: ${email}`
            )
        }
        return user
    }

    async findUserById(userId) {
        const user = await User.findById(userId)
        if (!user) {
            throw new BaseException(HttpStatus.NOT_FOUND,
                ApiResponseCode.DATABASE_ERROR,
                `Can not found with user id ${userId}`)
        }

        return user

    }

}

const userService = new UserService();
export default userService;