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
        <div>
            <h2>Admin Signup</h2>
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

                <button type="submit">Register</button>

                <p>
                    Already have an account? <Link to="/login">Login here</Link>
                </p>
            </form>
        </div>
    );
}

export default AdminSignup;
