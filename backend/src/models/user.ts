import mongoose, { Schema, Document, model } from 'mongoose';

export interface IUser extends Document {
    username: string;
    password: string;
    instrument: 'none' | 'drums' | 'guitars' | 'bass' | 'saxophone' | 'keyboards' | 'vocals';
    role: 'user' | 'admin';
}

const userSchema: Schema<IUser> = new Schema({
    username: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    instrument: {
        type: String,
        required: false,
        enum: ['none', 'drums', 'guitars', 'bass', 'saxophone', 'keyboards', 'vocals'], // הוספתי 'none'
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
