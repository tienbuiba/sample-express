import mongoose from "mongoose";
import mongooseDelete from "mongoose-delete";

const CourseSchema = new mongoose.Schema(
    {
        name: {
            require: true,
            type: String,
            maxLength: 255,
        },
        description: {
            require: true,
            type: String,
            maxLength: 600,
        },
        image: {
            require: true,
            type: String,
            maxLength: 255
        }
    },
    {
        versionKey: false,
        timestamps: true
    }
);

// Add plugin
CourseSchema.plugin(mongooseDelete, {
    deletedAt: true,
    deletedBy: true,
    overrideMethods: 'all'
});

const Course = mongoose.model('Course', CourseSchema);

export default Course;