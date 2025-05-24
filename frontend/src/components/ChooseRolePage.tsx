import React from 'react';
import { useNavigate } from 'react-router-dom';

const ChooseRolePage = () => {
    const navigate = useNavigate();

    return (
        <div style={{ textAlign: 'center', marginTop: '100px' }}>
            <h1>Choose Registration Type</h1>
            <button
                style={{ margin: '10px', padding: '10px 20px', fontSize: '18px' }}
                onClick={() => navigate('/user-signup')}
            >
                User Signup
            </button>
            <button
                style={{ margin: '10px', padding: '10px 20px', fontSize: '18px' }}
                onClick={() => navigate('/admin-signup')}
            >
                Admin Signup
            </button>
        </div>
    );
};

export default ChooseRolePage;
