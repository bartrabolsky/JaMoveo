import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { socket } from '../socket';
import { useSong } from '../context/SongContext';

const PlayerMain = () => {
    const [waiting, setWaiting] = useState(true);
    const navigate = useNavigate();
    const { setCurrentSong } = useSong();

    useEffect(() => {
        const userData = localStorage.getItem('user');
        const role = userData ? JSON.parse(userData).role : null;

        if (role !== 'admin') {
            socket.on('song_selected', (songData) => {
                console.log('Song selected (user):', songData);
                setCurrentSong(songData);
                setWaiting(false);
                navigate('/liveplayer');
            });
        }

        return () => {
            socket.off('song_selected');
        };
    }, [navigate, setCurrentSong]);

    return (
        <div className="min-h-screen bg-gradient-to-b from-purple-900 via-indigo-900 to-black flex items-center justify-center p-6 text-white">
            <h1 className="text-3xl sm:text-4xl font-semibold text-center">
                {waiting ? 'Waiting for next song' : 'Song is starting...'}
            </h1>
        </div>
    );
};

export default PlayerMain;
