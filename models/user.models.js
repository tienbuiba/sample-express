import mongoose from "mongoose";
import mongooseDelete from "mongoose-delete";

const UserSchema = new mongoose.Schema({
    firstName: {
        type: String,
        require: true,
    },
    lastName: {
        type: String,
        require: true,
    },
    email: {
        type: String,
        require: true,
    },
    phone: {
        type: String,
        require: true,
    },
    password: {
        type: String,
        require: true,
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