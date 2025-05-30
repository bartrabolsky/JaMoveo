import dotenv from 'dotenv';
import express, { Request, Response } from 'express';
import cors from 'cors';
import mongoose from 'mongoose';
import http from 'http';
import authRoutes from './routes/authRoutes';
import songRoutes from './routes/songRoutes';
import { setupSocket } from './utils/socket';


dotenv.config();

console.log('Loaded MONGO_URI:', process.env.MONGO_URI);

const app = express();
const server = http.createServer(app);

const PORT = process.env.PORT || 5000;

const MONGO_URI = process.env.MONGO_URI;
if (!MONGO_URI) {
    console.error('Error: MONGO_URI is not defined in environment variables.');
    process.exit(1);
}

app.use(cors({
    origin: '*',
}));
app.use(express.json());

app.use('/api', authRoutes);
app.use('/api', songRoutes);


mongoose.connect(MONGO_URI)
    .then(() => {
        console.log('MongoDB connected');

        setupSocket(server);

        server.listen(PORT, () => {
            console.log(`Server running on port ${PORT}`);
        });
    })
    .catch((err) => {
        console.error('MongoDB connection error:', err);
    });
