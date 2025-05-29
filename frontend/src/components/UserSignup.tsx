import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { socket } from '../services/socket';

function UserSignup() {
    const navigate = useNavigate();
    const apiUrl = process.env.REACT_APP_API_URL;
    // State to hold form data
    const [formData, setFormData] = useState({
        username: '',
        password: '',
        instrument: 'drums',
        role: 'user',
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
            // Call backend signup endpoint
            const response = await fetch(`${apiUrl}/api/signup`, {
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
                        instrument: formData.instrument,
                        role: formData.role,
                    })
                );

                socket.connect();

                socket.emit('user_login', {
                    userId: data.id,
                    role: formData.role,
                    instrument: formData.instrument,
                });

                navigate('/player');
            } else {
                setMessage('User already exists. Please choose a different username.');
            }
        } catch {
            setMessage('Server error');
        }
    }

    return (
        // Page styling
        <div className="min-h-screen bg-gradient-to-b from-purple-900 via-indigo-900 to-black flex flex-col items-center justify-center p-6 text-white">
            <div className="max-w-md w-full bg-gray-900 bg-opacity-70 rounded-lg p-8 shadow-lg">
                <h2 className="text-3xl font-bold mb-6 text-center">User Signup</h2>

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

                    <div>
                        <label className="block mb-2 font-semibold" htmlFor="instrument">
                            Instrument:
                        </label>
                        <select
                            id="instrument"
                            name="instrument"
                            value={formData.instrument}
                            onChange={handleChange}
                            required
                            className="w-full px-4 py-2 rounded-md bg-gray-800 border border-gray-700 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                        >
                            <option value="drums">drums</option>
                            <option value="guitars">guitars</option>
                            <option value="bass">bass</option>
                            <option value="saxophone">saxophone</option>
                            <option value="keyboards">keyboards</option>
                            <option value="vocals">vocals</option>
                        </select>
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

export default UserSignup;
