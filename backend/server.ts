import dotenv from 'dotenv';
import express, { Request, Response } from 'express';
import cors from 'cors';
import mongoose from 'mongoose';
import authRoutes from './src/routes/authRoutes';


dotenv.config();

console.log('Loaded MONGO_URI:', process.env.MONGO_URI);

const app = express();


const PORT = process.env.PORT ? parseInt(process.env.PORT, 10) : 5000;


const MONGO_URI = process.env.MONGO_URI;
if (!MONGO_URI) {
    console.error('Error: MONGO_URI is not defined in environment variables.');
    process.exit(1);
}

app.use(cors());
app.use(express.json());

app.use('/api', authRoutes);

app.get('/', (req: Request, res: Response) => {
    res.send('hello backend is running');
});

// app.get('/hello', (req: Request, res: Response) => {
//     res.send('hello');
// });

mongoose.connect(MONGO_URI)
    .then(() => console.log('MongoDB connected'))
    .catch((err) => console.error('MongoDB connection error:', err));



app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
