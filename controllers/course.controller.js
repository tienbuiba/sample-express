import courseService from "../services/course.service.js";

//[POST] /create-course
export const createCourse = async (req, res, next) => {
    const { name, description } = req.body;

    if (!name || !description) {
        return res.status(400).json({
            message: 'Invalid request body',
        })
    }

    const course = await courseService.create({ name, description });
    return res.status(200).json({
        message: "Successfully!",
        data: course,
    })
}

//[GET] /all-course
export const findAllCourse = async (req, res, next) => {
    const courses = await courseService.findAll();
    return res.status(200).json({
        message: "Successfully",
        data: courses,
    })
}

//[PUT] /edit-course
export const updateCourse = async (req, res, next) => {

    const { id, name, description } = req.body

    const course = await courseService.updateById({ id, name, description });

    return res.status(200).json({
        message: "Successfully",
        data: course
    })

}

//[DELETE] /delete-course
export const deleteCourse = async (req, res, next) => {


    const course = await courseService.deleteOneById(req.params.id)

    return res.status(200).json({
        message: "Successfully",
        data: course
    })

}

//[PATCH] /restore-course
export const restoreCourse = async (req, res, next) => {
    const course = await courseService.restoreCourse(req.params.id)

    return res.status(200).json({
        message: "Successfully",
        data: course
    })

}

//[POST] /handle-form-action-course
export const handleFormActions = async (req, res, next) => {
    const course = await courseService.deleteOneById({ $in: req.body.courseId })

    return res.status(200).json({
        message: "Successfully",
        data: course
    })
}