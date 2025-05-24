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
        <div style={{ padding: '2rem' }}>
            <h1>Search Results</h1>
            {loading && <p>Loading...</p>}
            {!loading && error && <p style={{ color: 'red' }}>{error}</p>}
            {!loading && !error && songs.length === 0 && <p>No results found.</p>}

            {!loading && !error && songs.length > 0 && (
                <ul style={{ listStyle: 'none', padding: 0 }}>
                    {songs.map((song, index) => (
                        <li key={index} onClick={() => handleSelectSong(song)} style={{
                            border: '1px solid #ccc',
                            padding: '1rem',
                            borderRadius: '8px',
                            marginBottom: '1rem',
                            cursor: 'pointer',
                            display: 'flex',
                            alignItems: 'center',
                            gap: '1rem'
                        }}>
                            {song.image && (
                                <img src={song.image} alt={song.title} style={{ width: '60px', height: '60px', borderRadius: '6px', objectFit: 'cover' }} />
                            )}
                            <div>
                                <strong>{song.title} /</strong>
                                <p>{song.artist}</p>
                            </div>
                        </li>
                    ))}
                </ul>
            )}
        </div>
    );
};

export default ResultsPage;
