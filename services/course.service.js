import Course from "../models/course.models.js";

class CourseService {

    async findOne(id) {
        const course = await Course.findById(id);
        if (!course) {
            throw new Error(`Course not found with id ${id}`);
        }
        return course;
    }

    async findAll() {
        return await Course.find();
    }

    async create(data) {
        const course = await Course.create({
            name: data?.name,
            description: data?.description,
        })
        return course;
    }

    async updateById(data) {
        const course = await Course.findByIdAndUpdate(data?.id, {
            name: data?.name,
            description: data?.description,
        }, { new: true })

        if (!course) {
            throw new Error(`Cant update course with ${id}`)
        }
        return course
    }

    async deleteOneById(id) {
        return await Course.delete({ id })
    }

    async restoreCourse(id) {
        return await Course.restore({ id })
    }

}

const courseService = new CourseService();
export default courseService;