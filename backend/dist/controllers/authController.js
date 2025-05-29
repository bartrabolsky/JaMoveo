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
exports.login = exports.signupAdmin = exports.signupUser = void 0;
const bcrypt_1 = __importDefault(require("bcrypt"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const user_1 = __importDefault(require("../models/user"));
// check if a user  already exists
function checkUserExists(username) {
    return __awaiter(this, void 0, void 0, function* () {
        return yield user_1.default.findOne({ username });
    });
}
// User signup handler
const signupUser = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { username, password, instrument } = req.body;
        const role = 'user';
        if (yield checkUserExists(username)) {
            return res.status(400).json({ message: 'Username already exists' });
        }
        const allowedInstrumentsUser = ['drums', 'guitars', 'bass', 'saxophone', 'keyboards', 'vocals'];
        if (!allowedInstrumentsUser.includes(instrument)) {
            return res.status(400).json({ message: 'Invalid instrument selected' });
        }
        const hashedPassword = yield bcrypt_1.default.hash(password, 10);
        const user = new user_1.default({
            username,
            password: hashedPassword,
            instrument,
            role,
        });
        yield user.save();
        return res.status(201).json({ id: user._id, role: user.role, instrument: user.instrument });
    }
    catch (error) {
        console.error('Signup user error:', error);
        return res.status(500).json({ message: 'Server error' });
    }
});
exports.signupUser = signupUser;
// Admin signup handler (only one admin allowed)
const signupAdmin = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { username, password } = req.body;
        const role = 'admin';
        if (yield checkUserExists(username)) {
            return res.status(400).json({ message: 'Username already exists' });
        }
        const existingAdmin = yield user_1.default.findOne({ role: 'admin' });
        if (existingAdmin) {
            return res.status(403).json({ message: 'Admin user already exists' });
        }
        const hashedPassword = yield bcrypt_1.default.hash(password, 10);
        const user = new user_1.default({
            username,
            password: hashedPassword,
            instrument: 'none',
            role,
        });
        yield user.save();
        return res.status(201).json({ id: user._id, role: user.role, instrument: user.instrument });
    }
    catch (error) {
        console.error('Signup admin error:', error);
        return res.status(500).json({ message: 'Server error' });
    }
});
exports.signupAdmin = signupAdmin;
//Login handler
const login = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { username, password } = req.body;
        const user = yield user_1.default.findOne({ username });
        if (!user) {
            return res.status(400).json({ message: 'Invalid credentials' });
        }
        const isMatch = yield bcrypt_1.default.compare(password, user.password);
        if (!isMatch) {
            return res.status(400).json({ message: 'Invalid credentials' });
        }
        const jwtSecret = process.env.JWT_SECRET;
        if (!jwtSecret) {
            console.error('JWT_SECRET is not defined');
            return res.status(500).json({ message: 'Server error' });
        }
        const token = jsonwebtoken_1.default.sign({ userId: user._id, instrument: user.instrument, role: user.role }, jwtSecret, { expiresIn: '1h' });
        return res.json({
            token,
            id: user._id,
            role: user.role,
            instrument: user.instrument,
        });
    }
    catch (error) {
        console.error('Login error:', error);
        return res.status(500).json({ message: 'Server error' });
    }
});
exports.login = login;
