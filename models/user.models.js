import mongoose from "mongoose";
import mongooseDelete from "mongoose-delete";

const UserSchema = new mongoose.Schema({
    firstName: {
        type: String,
        require: true,
        maxLength: 255,
    },
    lastName: {
        type: String,
        require: true,
        maxLength: 255,
    },
    email: {
        type: String,
        require: true,
        maxLength: 255,
    },
    phone: {
        type: String,
        require: true,
        maxLength: 255,
    },
    password: {
        type: String,
        require: true,
        maxLength: 255,
    },
    dateOfBirth: {
        type: String,
    },
    gender: {
        type: String,
        require: true
    },
    avatarUrl: {
        type: String,
        default: 'avar_default.png',
    },
    isBlock: {
        type: Number,//0:active, 1:Block
        require: true,
        default: 0
    }

}, {

    versionKey: false,
    timestamps: true

})

// Add plugin
UserSchema.plugin(mongooseDelete, {
    deletedAt: true,
    deletedBy: true,
    overrideMethods: 'all'
});

const User = mongoose.model('User', UserSchema)


export default User;