import express from 'express';
import dotenv from 'dotenv';
import bodyParser from 'body-parser';
import mongoose from 'mongoose';
import cors from 'cors';
import Route from './Route/LawyerRoute.js';
import Route1 from './Route/ProfileRoute.js'
import path from "path";

const app = express();
dotenv.config();

app.use(cors());
app.use(bodyParser.json());

app.use('/api/case', Route);
app.use('/api/profile',Route1);

app.use("/uploads", express.static(path.join(process.cwd(), "uploads")));


const port = process.env.PORT;
const url = process.env.MONGO_URL;

mongoose.connect(url)
    .then(() => {
        console.log("Database connected");
        app.listen(port, () => {
            console.log(`Server is running on port ${port}`);
        });
    })
    .catch(err => console.error("Database connection error:", err));
