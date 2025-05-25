import mongoose, { Schema, Document, model } from 'mongoose';

// Define the IUser interface extending mongoose Document
export interface IUser extends Document {
    username: string;
    password: string;
    instrument: 'none' | 'drums' | 'guitars' | 'bass' | 'saxophone' | 'keyboards' | 'vocals';
    role: 'user' | 'admin';
}

// Define the schema for the User model
const userSchema: Schema<IUser> = new Schema({
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

export default model<IUser>('User', userSchema);
