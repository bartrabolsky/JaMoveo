import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';

function Login() {
    const navigate = useNavigate();

    const [formData, setFormData] = useState({
        username: '',
        password: '',
        role: '',
        instrument: '',
    });

    const [message, setMessage] = useState('');

    function handleChange(event: any) {
        const name = event.target.name;
        const value = event.target.value;
        // const role = event.target.value;
        // const instrument = event.target.value;
        setFormData(prev => ({ ...prev, [name]: value }));
    }

    async function handleSubmit(event: any) {
        event.preventDefault();
        setMessage('');

        try {
            const response = await fetch('http://localhost:5000/api/login', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(formData),
            });

            const data = await response.json();

            if (response.ok) {
                localStorage.setItem('token', data.token);
                console.log('data role:', data.role);
                setMessage('Login successful!');

                if (data.role === 'admin') {
                    navigate('/AdminMain');
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
}

export default Login;
