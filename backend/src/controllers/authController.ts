import { Request, Response } from 'express';
import User from '../models/user';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';

// Allowed instruments list for regular users (without 'none')
const allowedInstrumentsUser = ['drums', 'guitars', 'bass', 'saxophone', 'keyboards', 'vocals'];
// Allowed instruments list for admins (including 'none')
const allowedInstrumentsAdmin = ['none', ...allowedInstrumentsUser];

export const signup = async (req: Request, res: Response): Promise<void> => {
    try {
        const { username, password, instrument, role } = req.body;

        // Validate instrument choice based on role
        if (role === 'admin') {
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

        // Check if user already exists
        const existingUser = await User.findOne({ username });
        if (existingUser) {
            res.status(400).json({ message: 'Username already exists' });
            return;
        }

        // If role is admin, check if there is already an admin
        if (role === 'admin') {
            const existingAdmin = await User.findOne({ role: 'admin' });
            if (existingAdmin) {
                res.status(400).json({ message: 'Admin user already exists' });
                return;
            }
        }

        // Hash the password
        const hashedPassword = await bcrypt.hash(password, 10);

        // Create new user
        const user = new User({
            username,
            password: hashedPassword,
            instrument,
            role: role || 'user', // default role is 'user' if not specified
        });

        await user.save();

        res.status(201).json({ message: 'User created successfully' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
};

export const login = async (req: Request, res: Response): Promise<void> => {
    try {
        const { username, password } = req.body;

        // Find user by username
        const user = await User.findOne({ username });
        if (!user) {
            res.status(400).json({ message: 'Invalid credentials' });
            return;
        }

        // Compare password hash
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            res.status(400).json({ message: 'Invalid credentials' });
            return;
        }

        // Create JWT token
        const token = jwt.sign(
            { userId: user._id, instrument: user.instrument, role: user.role },
            process.env.JWT_SECRET as string,
            { expiresIn: '1h' }
        );

        res.json({ token });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
};
