import { Request, Response } from 'express';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import User, { IUser } from '../models/user';

async function checkUserExists(username: string): Promise<IUser | null> {
    return await User.findOne({ username });
}

export const signupUser = async (req: Request, res: Response): Promise<Response> => {
    try {
        const { username, password, instrument } = req.body;
        const role = 'user';

        if (await checkUserExists(username)) {
            return res.status(400).json({ message: 'Username already exists' });
        }

        const allowedInstrumentsUser = ['drums', 'guitars', 'bass', 'saxophone', 'keyboards', 'vocals'];
        if (!allowedInstrumentsUser.includes(instrument)) {
            return res.status(400).json({ message: 'Invalid instrument selected' });
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        const user = new User({
            username,
            password: hashedPassword,
            instrument,
            role,
        });

        await user.save();

        return res.status(201).json({ id: user._id, role: user.role, instrument: user.instrument });
    } catch (error) {
        console.error('Signup user error:', error);
        return res.status(500).json({ message: 'Server error' });
    }
};

export const signupAdmin = async (req: Request, res: Response): Promise<Response> => {
    try {
        const { username, password } = req.body;
        const role = 'admin';

        if (await checkUserExists(username)) {
            return res.status(400).json({ message: 'Username already exists' });
        }

        const existingAdmin = await User.findOne({ role: 'admin' });
        if (existingAdmin) {
            return res.status(403).json({ message: 'Admin user already exists' });
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        const user = new User({
            username,
            password: hashedPassword,
            instrument: 'none',
            role,
        });

        await user.save();

        return res.status(201).json({ id: user._id, role: user.role, instrument: user.instrument });
    } catch (error) {
        console.error('Signup admin error:', error);
        return res.status(500).json({ message: 'Server error' });
    }
};

export const login = async (req: Request, res: Response): Promise<Response> => {
    try {
        const { username, password } = req.body;

        const user = await User.findOne({ username });
        if (!user) {
            return res.status(400).json({ message: 'Invalid credentials' });
        }

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(400).json({ message: 'Invalid credentials' });
        }

        const jwtSecret = process.env.JWT_SECRET;
        if (!jwtSecret) {
            console.error('JWT_SECRET is not defined');
            return res.status(500).json({ message: 'Server error' });
        }

        const token = jwt.sign(
            { userId: user._id, instrument: user.instrument, role: user.role },
            jwtSecret,
            { expiresIn: '1h' }
        );

        return res.json({
            token,
            id: user._id,
            role: user.role,
            instrument: user.instrument,
        });
    } catch (error) {
        console.error('Login error:', error);
        return res.status(500).json({ message: 'Server error' });
    }
};
