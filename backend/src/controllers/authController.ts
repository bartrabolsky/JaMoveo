import { Request, Response } from 'express';
import User from '../models/user';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';

const allowedInstrumentsUser = ['drums', 'guitars', 'bass', 'saxophone', 'keyboards', 'vocals'];
const allowedInstrumentsAdmin = ['none', ...allowedInstrumentsUser];

export const signup = async (req: Request, res: Response): Promise<void> => {
    try {
        let { username, password, instrument, role } = req.body;

        const userRole = role || 'user';

        if (typeof instrument === 'string') {
            instrument = instrument.toLowerCase();
        }

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

        res.status(201).json({ message: 'User created successfully' });

    } catch (error: unknown) {
        console.error('Signup error:', error);
        res.status(500).json({ message: 'Server error' });
    }
};
