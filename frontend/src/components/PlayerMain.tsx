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
        <div>
            <h1>{waiting ? 'Waiting for next song' : 'Song is starting...'}</h1>
        </div>
    );
};

export default PlayerMain;
