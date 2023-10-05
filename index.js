import express from 'express';
import 'dotenv/config';
import cors from 'cors';
import mongoConnect from './config/db/dbConnect.js';
import { courseRoute, userRoute } from './routes/index.js';
import { sortMiddleware } from './middlewares/Sort.middleware.js';

const app = express();

app.use(cors());
app.use(express.json());

// customer middleware
app.use(sortMiddleware)

// course routes
app.use(courseRoute);

// userRoute
app.use(userRoute)

const port = process.env.SERVER_PORT || 8080;

app.listen(port, async () => {
    console.log(`Application running on http://localhost:${port}`);
    await mongoConnect();
})