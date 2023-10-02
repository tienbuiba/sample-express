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
            throw new Error(`User not found with id ${email}`);
        }
        return user

    }


    async findAll() {
        return await User.find()
    }

    async create(data) {

        const user = User.create(data)
        return user;

    }

}

const userService = new UserService();
export default userService;