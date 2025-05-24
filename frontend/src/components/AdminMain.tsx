import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const AdminMain = () => {
    const [query, setQuery] = useState('');
    const navigate = useNavigate();

    const handleSearch = () => {
        if (query.trim()) {
            localStorage.setItem('searchQuery', query);
            navigate('/results');
        }
    };

    return (
        <div style={{ padding: '2rem' }}>
            <h1>Search any song...</h1>
            <input
                type="text"
                placeholder="Type song name or artist"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                style={{ padding: '0.5rem', width: '300px', marginRight: '1rem' }}
            />
            <button onClick={handleSearch}>Search</button>
        </div>
    );
};

export default AdminMain;
