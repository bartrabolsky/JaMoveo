import React, { useState, ChangeEvent, FormEvent } from 'react';
import { Link } from 'react-router-dom';

interface RegisterData {
    username: string;
    password: string;
    instrument: string;
    role: string;
}

const Register: React.FC = () => {
    const [formData, setFormData] = useState<RegisterData>({
        username: '',
        password: '',
        instrument: 'drums',
        role: 'user'
    });

    const [message, setMessage] = useState<string>('');

    const handleChange = (e: ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setMessage('');

        try {
            const response = await fetch('http://localhost:5000/api/auth/signup', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(formData),
            });

            const data = await response.json();
            setMessage(data.message);
        } catch (error) {
            setMessage('Server error');
        }
    };

    return (
        <div>
            <h2>Register</h2>
            {message && <p>{message}</p>}
            <form onSubmit={handleSubmit}>
                <div>
                    <label>Username:</label><br />
                    <input
                        type="text"
                        name="username"
                        value={formData.username}
                        onChange={handleChange}
                        required
                    />
                </div>

                <div>
                    <label>Password:</label><br />
                    <input
                        type="password"
                        name="password"
                        value={formData.password}
                        onChange={handleChange}
                        required
                    />
                </div>

                {formData.role !== 'admin' && (
                    <div>
                        <label>Instrument:</label><br />
                        <select
                            name="instrument"
                            value={formData.instrument}
                            onChange={handleChange}
                            required
                        >
                            <option value="drums">Drums</option>
                            <option value="guitars">Guitars</option>
                            <option value="bass">Bass</option>
                            <option value="saxophone">Saxophone</option>
                            <option value="keyboards">Keyboards</option>
                            <option value="vocals">Vocals</option>
                        </select>
                    </div>
                )}

                <div>
                    <label>Role:</label><br />
                    <select
                        name="role"
                        value={formData.role}
                        onChange={handleChange}
                        required
                    >
                        <option value="user">User</option>
                        <option value="admin">Admin</option>
                    </select>
                </div>

                <button type="submit">Register</button>

                <p>
                    Already have an account? <Link to="/login">Login here</Link>
                </p>
            </form>
        </div>
    );
};

export default Register;
