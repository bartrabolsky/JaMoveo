import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { socket } from '../services/socket';

function Login() {
    const navigate = useNavigate();
    const apiUrl = process.env.REACT_APP_API_URL;
    const [formData, setFormData] = useState({
        username: '',
        password: '',
    });

    const [message, setMessage] = useState('');
    // Update form data when input fields change
    function handleChange(event: React.ChangeEvent<HTMLInputElement>) {
        const { name, value } = event.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    }

    async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
        event.preventDefault();
        setMessage('');

        try {
            // Send login request to backend
            const response = await fetch(`${apiUrl}/api/login`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(formData),
            });

            const data = await response.json();

            if (response.ok) {
                localStorage.setItem('token', data.token);

                localStorage.setItem(
                    'user',
                    JSON.stringify({
                        id: data.id,
                        username: data.username,
                        instrument: data.instrument,
                        role: data.role,
                    })
                );

                setMessage('Login successful!');

                socket.connect();

                socket.emit('user_login', {
                    userId: data.id,
                    role: data.role,
                    instrument: data.instrument,
                });

                if (data.role === 'admin') {
                    navigate('/admin');
                } else {
                    navigate('/player');
                }
            } else {
                setMessage('Login failed');
            }
        } catch {
            setMessage('Server error');
        }
    }

    return (
        // Page styling
        <div className="min-h-screen bg-gradient-to-b from-purple-900 via-indigo-900 to-black flex flex-col items-center justify-center p-6 text-white">
            <div className="max-w-md w-full bg-gray-900 bg-opacity-70 rounded-lg p-8 shadow-lg">
                <h2 className="text-3xl font-bold mb-6 text-center">Login</h2>

                {message && (
                    <p className="mb-4 text-center text-red-400 font-semibold">{message}</p>
                )}

                <form onSubmit={handleSubmit} className="space-y-6">
                    <div>
                        <label className="block mb-2 font-semibold" htmlFor="username">
                            Username:
                        </label>
                        <input
                            id="username"
                            type="text"
                            name="username"
                            value={formData.username}
                            onChange={handleChange}
                            required
                            className="w-full px-4 py-2 rounded-md bg-gray-800 border border-gray-700 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                            placeholder="Enter your username"
                        />
                    </div>

                    <div>
                        <label className="block mb-2 font-semibold" htmlFor="password">
                            Password:
                        </label>
                        <input
                            id="password"
                            type="password"
                            name="password"
                            value={formData.password}
                            onChange={handleChange}
                            required
                            className="w-full px-4 py-2 rounded-md bg-gray-800 border border-gray-700 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                            placeholder="Enter your password"
                        />
                    </div>

                    <button
                        type="submit"
                        className="w-full bg-indigo-700 hover:bg-indigo-600 transition-colors py-3 rounded-md text-lg font-semibold shadow-md"
                    >
                        Login
                    </button>
                </form>

                <p className="mt-6 text-center text-gray-300">
                    Don't have an account?{' '}
                    <Link to="/user-signup" className="text-indigo-400 hover:underline">
                        Sign up as user
                    </Link>{' '}
                    or{' '}
                    <Link to="/admin-signup" className="text-indigo-400 hover:underline">
                        Sign up as admin
                    </Link>
                </p>
            </div>
        </div>
    );
}

export default Login;
