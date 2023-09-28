import express from 'express';
import { createCourse, deleteCourse, findAllCourse, handleFormActions, restoreCourse, updateCourse } from '../controllers/course.controller.js';

const router = express.Router();

//[POST] CREATE COURSE
router.post('/api/v1/create', createCourse);

//[GET] GET ALL COURSE
router.get('/api/v1/all-course', findAllCourse);

//[PUT] UPDATE COURSE
router.put('/api/v1/edit-course', updateCourse)

//[DELETE] DELETE COURSE
router.delete('/api/v1/delete-course', deleteCourse)

//[PATCH] RESTORE COURSE
router.patch('api/v1/restore-course', restoreCourse)

//[POST] handle-form-action-course
router.post('api/v1/handle-form-action-course', handleFormActions)

export default router;