import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { socket } from '../socket';

function UserSignup() {
    const navigate = useNavigate();

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
            const response = await fetch('http://localhost:5000/api/signup', {
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
                setMessage('Error occurred');
            }
        } catch {
            setMessage('Server error');
        }
    }

    return (
        <div>
            <h2>User Signup</h2>
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

                <div>
                    <label>Instrument:</label><br />
                    <select
                        name="instrument"
                        value={formData.instrument}
                        onChange={handleChange}
                        required
                    >
                        <option value="drums">drums</option>
                        <option value="guitars">guitars</option>
                        <option value="bass">bass</option>
                        <option value="saxophone">saxophone</option>
                        <option value="keyboards">keyboards</option>
                        <option value="vocals">vocals</option>
                    </select>
                </div>

                <button type="submit">Register</button>

                <p>
                    Already have an account? <Link to="/login">Login here</Link>
                </p>
            </form>
        </div>
    );
}

export default UserSignup;
