import express from 'express';
import { createCourse, deleteCourse, findAllCourse, handleFormActions, restoreCourse, updateCourse } from '../controllers/course.controller.js';

const courseRouter = express.Router();

//[POST] CREATE COURSE
courseRouter.post('/api/v1/create-course', createCourse);

//[GET] GET ALL COURSE
courseRouter.get('/api/v1/all-course', findAllCourse);

//[PUT] UPDATE COURSE
courseRouter.put('/api/v1/edit-course', updateCourse)

//[DELETE] DELETE COURSE
courseRouter.delete('/api/v1/delete-course', deleteCourse)

//[PATCH] RESTORE COURSE
courseRouter.patch('api/v1/restore-course', restoreCourse)

//[POST] handle-form-action-course
courseRouter.post('api/v1/handle-form-action-course', handleFormActions)

export default courseRouter;