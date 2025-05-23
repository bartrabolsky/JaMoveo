import React, { useState, ChangeEvent, FormEvent } from 'react';
import { Link } from 'react-router-dom';

interface LoginData {
    username: string;
    password: string;
}

const Login: React.FC = () => {
    const [formData, setFormData] = useState<LoginData>({
        username: '',
        password: '',
    });

    const [message, setMessage] = useState<string>('');

    const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setMessage('');

        try {
            const response = await fetch('http://localhost:5000/api/auth/login', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(formData),
            });

            const data = await response.json();

            if (response.ok) {
                // Save token to localStorage
                localStorage.setItem('token', data.token);
                setMessage('Login successful!');
                // Optionally redirect here
            } else {
                setMessage(data.message || 'Login failed');
            }
        } catch (error) {
            setMessage('Server error');
        }
    };

    return (
        <div>
            <h2>Login</h2>
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

                <button type="submit">Login</button>

                <p>
                    Don't have an account? <Link to="/signup">Sign up here</Link>
                </p>
            </form>
        </div>
    );
};

export default Login; 