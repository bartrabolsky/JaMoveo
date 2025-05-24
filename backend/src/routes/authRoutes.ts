import express, { Request, Response } from 'express';
import User from '../models/user';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
// import { signup, login } from '../controllers/authController';

const router = express.Router();


const allowedInstrumentsUser = ['drums', 'guitars', 'bass', 'saxophone', 'keyboards', 'vocals'];
const allowedInstrumentsAdmin = ['none', ...allowedInstrumentsUser];


router.post('/signup', async (req: Request, res: Response): Promise<void> => {
    try {
        const { username, password, instrument, role } = req.body;

        const userRole = role || 'user';

        if (userRole === 'admin') {
            if (!allowedInstrumentsAdmin.includes(instrument)) {
                res.status(400).json({ message: 'Invalid instrument selected for admin' });
                return;
            }
        } else {
            if (!allowedInstrumentsUser.includes(instrument)) {
                res.status(400).json({ message: 'Invalid instrument selected' });
                return;
            }
        }

        const existingUser = await User.findOne({ username });
        if (existingUser) {
            res.status(400).json({ message: 'Username already exists' });
            return;
        }

        if (userRole === 'admin') {
            const existingAdmin = await User.findOne({ role: 'admin' });
            if (existingAdmin) {
                res.status(400).json({ message: 'Admin user already exists' });
                return;
            }
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        const user = new User({
            username,
            password: hashedPassword,
            instrument,
            role: userRole,
        });

        await user.save();

        // ✅ עדכון שורת התגובה
        res.status(201).json({
            message: 'User created successfully',
            id: user._id,
            role: user.role,
            instrument: user.instrument,
        });

    } catch (error: unknown) {
        console.error('Signup error:', error);
        res.status(500).json({ message: 'Server error' });
    }
});


router.post('/login', async (req: Request, res: Response): Promise<void> => {
    try {
        const { username, password } = req.body;

        const user = await User.findOne({ username });
        if (!user) {
            res.status(400).json({ message: 'Invalid credentials' });
            return;
        }

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            res.status(400).json({ message: 'Invalid credentials' });
            return;
        }

        const jwtSecret = process.env.JWT_SECRET;
        if (!jwtSecret) {
            console.error('JWT_SECRET is not defined');
            res.status(500).json({ message: 'Server error' });
            return;
        }

        const token = jwt.sign(
            { userId: user._id, instrument: user.instrument, role: user.role },
            jwtSecret,
            { expiresIn: '1h' }
        );
        console.log('role:', user.role);

        res.json({
            token,
            id: user._id,
            role: user.role,
            instrument: user.instrument,
        });


    } catch (error: unknown) {
        console.error('Login error:', error);
        res.status(500).json({ message: 'Server error' });
    }


});

export default router;
