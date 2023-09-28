import mongoose from "mongoose";

const mongoConnect = async () => {

    try {
        await mongoose.connect(process.env.MONGODB_URI);
        console.log('Connected to DB successfully!');
    } catch (error) {
        console.log('Error when connect to database: ', error);
    }

}

export default mongoConnect;