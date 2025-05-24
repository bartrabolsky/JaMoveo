import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { socket } from '../socket';

const PlayerMain = () => {
    const [waiting, setWaiting] = useState(true);
    const navigate = useNavigate();

    useEffect(() => {
        socket.on('song_selected', (songData) => {
            console.log('Song selected:', songData);
            setWaiting(false);
            navigate('/live');
        });

        return () => {
            socket.off('song_selected');
        };
    }, [navigate]);

    return (
        <div>
            <h1>{waiting ? 'Waiting for next song' : 'Song is starting...'}</h1>
        </div>
    );
};

export default PlayerMain;
