"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.login = exports.signup = void 0;
const user_1 = __importDefault(require("../models/user"));
const bcrypt_1 = __importDefault(require("bcrypt"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
// Allowed instruments list for regular users (without 'none')
const allowedInstrumentsUser = ['drums', 'guitars', 'bass', 'saxophone', 'keyboards', 'vocals'];
// Allowed instruments list for admins (including 'none')
const allowedInstrumentsAdmin = ['none', ...allowedInstrumentsUser];
const signup = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { username, password, instrument, role } = req.body;
        // Validate instrument choice based on role
        if (role === 'admin') {
            if (!allowedInstrumentsAdmin.includes(instrument)) {
                res.status(400).json({ message: 'Invalid instrument selected for admin' });
                return;
            }
        }
        else {
            if (!allowedInstrumentsUser.includes(instrument)) {
                res.status(400).json({ message: 'Invalid instrument selected' });
                return;
            }
        }
        // Check if user already exists
        const existingUser = yield user_1.default.findOne({ username });
        if (existingUser) {
            res.status(400).json({ message: 'Username already exists' });
            return;
        }
        // If role is admin, check if there is already an admin
        if (role === 'admin') {
            const existingAdmin = yield user_1.default.findOne({ role: 'admin' });
            if (existingAdmin) {
                res.status(400).json({ message: 'Admin user already exists' });
                return;
            }
        }
        // Hash the password
        const hashedPassword = yield bcrypt_1.default.hash(password, 10);
        // Create new user
        const user = new user_1.default({
            username,
            password: hashedPassword,
            instrument,
            role: role || 'user', // default role is 'user' if not specified
        });
        yield user.save();
        res.status(201).json({ message: 'User created successfully' });
    }
    catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
});
// exports.signup = signup;
const login = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { username, password } = req.body;
        // Find user by username
        const user = yield user_1.default.findOne({ username });
        if (!user) {
            res.status(400).json({ message: 'Invalid credentials' });
            return;
        }
        // Compare password hash
        const isMatch = yield bcrypt_1.default.compare(password, user.password);
        if (!isMatch) {
            res.status(400).json({ message: 'Invalid credentials' });
            return;
        }
        // Create JWT token
        const token = jsonwebtoken_1.default.sign({ userId: user._id, instrument: user.instrument, role: user.role }, process.env.JWT_SECRET, { expiresIn: '1h' });
        res.json({ token });
    }
    catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
});
exports.login = login;
