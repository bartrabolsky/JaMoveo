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
        <div className="min-h-screen bg-gradient-to-b from-purple-900 via-indigo-900 to-black flex flex-col items-center justify-center p-6 text-white">
            <div className="max-w-md w-full">
                <h1 className="text-3xl font-bold mb-6 text-center">Search any song...</h1>
                <div className="flex flex-col sm:flex-row gap-4">
                    <input
                        type="text"
                        placeholder="Type song name or artist"
                        value={query}
                        onChange={(e) => setQuery(e.target.value)}
                        className="flex-grow px-4 py-3 rounded-md bg-gray-800 border border-gray-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 text-white placeholder-gray-400"
                    />
                    <button
                        onClick={handleSearch}
                        className="bg-indigo-700 hover:bg-indigo-600 transition-colors px-6 py-3 rounded-md text-lg font-semibold shadow-md"
                    >
                        Search
                    </button>
                </div>
            </div>
        </div>
    );
};

export default AdminMain;
