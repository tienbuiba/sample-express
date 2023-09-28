import express from 'express';
import 'dotenv/config';
import cors from 'cors';
import mongoConnect from './config/db/dbConnect.js';
import { courseRoute } from './routes/index.js';

const app = express();

app.use(cors());
app.use(express.json());

// course routes
app.use(courseRoute);

const port = process.env.PORT || 3888;

app.listen(port, async () => {
    console.log(`Application running on http://localhost:${port}`);
    await mongoConnect();
})