import dotenv from 'dotenv';
import express, { Request, Response } from 'express';
import cors from 'cors';
import mongoose from 'mongoose';
import authRoutes from './routes/authRoutes';
// טען את הקובץ .env
dotenv.config();

console.log('Loaded MONGO_URI:', process.env.MONGO_URI); // <-- הוספתי שורת הדפסה לבדיקה

const app = express();

// וידוא ש-Port הוא מספר, אחרת ברירת מחדל 5000
const PORT = process.env.PORT ? parseInt(process.env.PORT, 10) : 5000;

// וידוא שה-MONGO_URI מוגדר
const MONGO_URI = process.env.MONGO_URI;
if (!MONGO_URI) {
    console.error('Error: MONGO_URI is not defined in environment variables.');
    process.exit(1); // יציאה עם שגיאה אם המחרוזת חסרה
}

app.use(cors());
app.use(express.json());



// התחברות למונגו
mongoose.connect(MONGO_URI)
    .then(() => console.log('MongoDB connected'))
    .catch((err) => console.error('MongoDB connection error:', err));

// שימוש ברוטים
app.use('/api/auth', authRoutes);

// נתיב בדיקה בסיסי
app.get('/', (req: Request, res: Response) => {
    res.send('JaMoveo backend is running');
});

// הפעלת השרת
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
