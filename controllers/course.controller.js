import { ApiResponseCode } from "../constants/apiStatus.constant.js";
import { HttpStatus } from "../constants/httpStatus.constant.js";
import BaseException from "../exceptions/base.exception.js";
import Course from "../models/course.models.js";
import courseService from "../services/course.service.js";

//[POST] /create-course
export const createCourse = async (req, res, next) => {
    try {
        const { name, description } = req.body;

        if (!name && !description) {
            throw new BaseException(
                HttpStatus.BAD_REQUEST,
                ApiResponseCode.INVALID_PARAM,
                'Name and description is require!'
            )
        }

        const course = await courseService.create({ name, description });
        return res.status(HttpStatus.OK).json({
            code: ApiResponseCode.SUCCESS,
            message: "Successfully!",
            data: course,
        })

    } catch (err) {
        if (err instanceof BaseException) {
            return res.status(err.httpStatus).send({
                code: err.apiStatus,
                message: err.message
            })
        }

        return res.status(HttpStatus.INTERNAL_SERVER_ERROR).send({
            code: ApiResponseCode.OTHER_ERROR,
            message: err.message
        })

    }

}

//[GET] /all-course
export const findAllCourse = async (req, res, next) => {

    try {

        const courses = await courseService.findAll();
        return res.status(HttpStatus.OK).json({
            code: ApiResponseCode.SUCCESS,
            message: "Successfully",
            data: courses,
        })

    } catch (err) {

        if (err instanceof BaseException) {
            return res.status(err.httpStatus).send({
                code: err.apiStatus,
                message: err.message,
            })
        }

        return res.status(HttpStatus.INTERNAL_SERVER_ERROR).send({
            code: ApiResponseCode.OTHER_ERROR,
            message: err.message
        })

    }

}

//[PUT] /edit-course
export const updateCourse = async (req, res, next) => {

    try {

        const { id, name, description } = req.body

        if (!id || !name || !description) {
            throw new BaseException(
                httpStatus.BAD_REQUEST,
                ApiResponseCode.INVALID_PARAM,
                "Name and Description is require!"
            )
        }

        const course = await courseService.updateById({ id, name, description });

        return res.status(HttpStatus.OK).json({
            code: ApiResponseCode.SUCCESS,
            message: "Successfully",
            data: course
        })

    } catch (err) {

        if (err instanceof BaseException) {
            return res.status(err.httpStatus).send({
                code: err.apiStatus,
                message: err.message,
            })
        }
        return res.status(HttpStatus.INTERNAL_SERVER_ERROR).send({
            code: ApiResponseCode.OTHER_ERROR,
            message: err.message
        })
    }

}

//[DELETE] /delete-course
export const deleteCourse = async (req, res, next) => {

    try {
        const { id } = req.params
        if (!id) {
            throw new BaseException(
                HttpStatus.BAD_REQUEST,
                ApiResponseCode.INVALID_PARAM,
                'Id id require!'
            )
        }

        const course = await courseService.deleteOneById(id)

        return res.status(HttpStatus.OK).json({
            code: ApiResponseCode.SUCCESS,
            message: "Successfully",
            data: course
        })

    } catch (err) {
        if (err instanceof BaseException) {
            return res.status(err.httpStatus).send({
                code: err.apiStatus,
                message: err.message
            })
        }
        return res.status(HttpStatus.INTERNAL_SERVER_ERROR).send({
            code: ApiResponseCode.OTHER_ERROR,
            message: err.message
        })
    }
}

//[PATCH] /restore-course
export const restoreCourse = async (req, res, next) => {

    try {

        const { id } = req.params

        if (!id) {
            throw new BaseException(
                HttpStatus.BAD_REQUEST,
                ApiResponseCode.INVALID_PARAM,
                'ID is require!'
            )
        }

        const course = await courseService.restoreCourse(id)

        return res.status(HttpStatus.OK).json({
            code: ApiResponseCode.SUCCESS,
            message: "Successfully",
            data: course
        })

    } catch (err) {

        if (err instanceof BaseException) {
            return res.status(err.httpStatus).send({
                code: err.apiStatus,
                message: err.message,
            })
        }

        return res.status(HttpStatus.INTERNAL_SERVER_ERROR).send({
            code: ApiResponseCode.OTHER_ERROR,
            message: err.message
        })

    }


}

//[POST] /handle-form-action-course
export const handleFormActions = async (req, res, next) => {

    try {

        const { courseId } = req.body

        if (!courseId) {
            throw new BaseException(
                HttpStatus.BAD_REQUEST,
                ApiResponseCode.INVALID_PARAM,
                'ID is require!'
            )
        }

        const course = await courseService.deleteOneById({ $in: courseId })

        return res.status(HttpStatus.OK).json({
            code: ApiResponseCode.SUCCESS,
            message: "Successfully",
            data: course
        })

    } catch (err) {

        if (err instanceof BaseException) {
            return res.status(err.httpStatus).send({
                code: err.apiStatus,
                message: err.message
            })
        }
        return res.status(HttpStatus.INTERNAL_SERVER_ERROR).send({
            code: ApiResponseCode.OTHER_ERROR,
            message: err.message
        })
    }
}

// sort course
export const sortCourse = async (req, res, next) => {

    try {
        const { column, type } = req.query

        if (!column || !type) {
            throw new BaseException(
                HttpStatus.BAD_REQUEST,
                ApiResponseCode.INVALID_PARAM,
                'column and type is require!'
            )
        }

        let courseQuery = Course.find({});

        if (req.query.hasOwnProperty('_sort')) {
            const isValidType = ['asc', 'desc'].includes(req.query.type);
            
            courseQuery = courseQuery.sort({
                // name: 'desc'
                [req.query.column]: isValidType ? req.query.type : 'desc'
            })
        }

    } catch (err) {

        if (err instanceof BaseException) {
            return res.status(err.httpStatus).send({
                code: err.apiStatus,
                message: err.message
            })
        }
        return res.status(HttpStatus.INTERNAL_SERVER_ERROR).send({
            code: ApiResponseCode.OTHER_ERROR,
            message: err.message
        })
    }

}