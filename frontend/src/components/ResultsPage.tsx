import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { socket } from '../socket';

interface Song {
    title: string;
    artist: string;
    link: string;
    image?: string;
}

const ResultsPage = () => {
    const [songs, setSongs] = useState<Song[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const navigate = useNavigate();

    useEffect(() => {
        const query = localStorage.getItem('searchQuery') || '';

        fetch(`http://localhost:5000/api/search-songs?query=${encodeURIComponent(query)}`)
            .then(res => res.json())
            .then(data => {
                if (Array.isArray(data)) {
                    setSongs(data);
                } else {
                    console.error('Unexpected response from server:', data);
                    setError('Unexpected server response');
                }
                setLoading(false);
            })
            .catch(err => {
                console.error('Fetch error:', err);
                setError('Failed to load search results');
                setLoading(false);
            });
    }, []);

    const handleSelectSong = (song: Song) => {
        socket.emit('select_song', song);
        navigate('/liveadmin');
    };

    return (
        <div className="min-h-screen bg-gradient-to-b from-purple-900 via-indigo-900 to-black p-6 text-white">
            <div className="max-w-lg mx-auto">
                <h1 className="text-3xl font-bold mb-6 text-center">Search Results</h1>

                {loading && <p className="text-center text-gray-300">Loading...</p>}

                {!loading && error && (
                    <p className="text-center text-red-400 font-semibold mb-4">{error}</p>
                )}

                {!loading && !error && songs.length === 0 && (
                    <p className="text-center text-gray-400">No results found.</p>
                )}

                {!loading && !error && songs.length > 0 && (
                    <ul className="space-y-4">
                        {songs.map((song, index) => (
                            <li
                                key={index}
                                onClick={() => handleSelectSong(song)}
                                className="flex items-center gap-4 p-4 bg-gray-800 rounded-lg cursor-pointer hover:bg-indigo-700 transition-colors"
                            >
                                {song.image && (
                                    <img
                                        src={song.image}
                                        alt={song.title}
                                        className="w-16 h-16 rounded-md object-cover flex-shrink-0"
                                    />
                                )}
                                <div>
                                    <strong className="block text-lg">{song.title} /</strong>
                                    <p className="text-gray-300">{song.artist}</p>
                                </div>
                            </li>
                        ))}
                    </ul>
                )}
            </div>
        </div>
    );
};

export default ResultsPage;
