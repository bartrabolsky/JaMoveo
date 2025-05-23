import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';

function Register() {
    const navigate = useNavigate();

    const [formData, setFormData] = useState({
        username: '',
        password: '',
        instrument: 'drums',
        role: 'user'
    });

    const [message, setMessage] = useState('');

    function handleChange(event: any) {
        const name = event.target.name;
        const value = event.target.value;
        setFormData(prev => ({ ...prev, [name]: value }));
    }

    async function handleSubmit(event: any) {
        event.preventDefault();
        setMessage('');

        try {
            console.log('Response data:', formData);

            const response = await fetch('http://localhost:5000/api/signup', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(formData),
            });

            const data = await response.json();
            console.log("111", data);

            if (response.ok) {

                if (data.userRole === 'admin') {
                    navigate('/admin');
                } else {
                    navigate('/player');
                }
            } else {
                setMessage('Error occurred');
            }
        } catch {
            setMessage('Server error');
        }
    }

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
                            <option value="drums">drums</option>
                            <option value="guitars">guitars</option>
                            <option value="bass">bass</option>
                            <option value="saxophone">saxophone</option>
                            <option value="keyboards">keyboards</option>
                            <option value="vocals">vocals</option>
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
}

export default Register;
