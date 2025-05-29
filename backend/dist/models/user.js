"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = require("mongoose");
// Define the schema for the User model
const userSchema = new mongoose_1.Schema({
    username: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    instrument: {
        type: String,
        required: false,
        enum: ['none', 'drums', 'guitars', 'bass', 'saxophone', 'keyboards', 'vocals'],
        default: 'none',
    },
    role: {
        type: String,
        required: true,
        enum: ['user', 'admin'],
        default: 'user',
    },
});
exports.default = (0, mongoose_1.model)('User', userSchema);
