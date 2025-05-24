import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { socket } from '../socket';

function AdminSignup() {
    const navigate = useNavigate();

    const [formData, setFormData] = useState({
        username: '',
        password: '',
        role: 'admin',
    });

    const [message, setMessage] = useState('');

    function handleChange(event: any) {
        const { name, value } = event.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    }

    async function handleSubmit(event: any) {
        event.preventDefault();
        setMessage('');

        try {
            const response = await fetch('http://localhost:5000/api/admin-signup', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(formData),
            });

            const data = await response.json();

            if (response.ok) {
                localStorage.setItem(
                    'user',
                    JSON.stringify({
                        id: data.id,
                        username: formData.username,
                        role: formData.role,
                    })
                );

                socket.connect();

                socket.emit('user_login', {
                    userId: data.id,
                    role: formData.role,
                    instrument: null,
                });

                navigate('/admin');
            } else {
                setMessage('Error occurred');
            }
        } catch {
            setMessage('Server error');
        }
    }

    return (
        <div className="min-h-screen bg-gradient-to-b from-purple-900 via-indigo-900 to-black flex flex-col items-center justify-center p-6 text-white">
            <div className="max-w-md w-full bg-gray-900 bg-opacity-70 rounded-lg p-8 shadow-lg">
                <h2 className="text-3xl font-bold mb-6 text-center">Admin Signup</h2>

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
                        Register
                    </button>
                </form>

                <p className="mt-6 text-center text-gray-300">
                    Already have an account?{' '}
                    <Link to="/login" className="text-indigo-400 hover:underline">
                        Login here
                    </Link>
                </p>
            </div>
        </div>
    );
}

export default AdminSignup;
