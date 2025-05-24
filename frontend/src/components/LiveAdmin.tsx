import React, { useEffect, useState } from 'react';
import { useSong } from '../context/SongContext';
import { useNavigate } from 'react-router-dom';
import { socket } from '../socket';
import { useUser } from '../useUser';

const LiveAdmin = () => {
    const { currentSong, setCurrentSong } = useSong();
    const { user } = useUser();
    const navigate = useNavigate();
    const [autoScroll, setAutoScroll] = useState(false);

    useEffect(() => {
        socket.on('song_selected', (songData) => {
            console.log('Admin received song:', songData);
            setCurrentSong(songData);
        });
        return () => {
            socket.off('song_selected');
        };
    }, [setCurrentSong]);

    useEffect(() => {
        socket.on('quit_song', () => {
            setCurrentSong(null);
            navigate('/admin');
        });
        return () => {
            socket.off('quit_song');
        };
    }, [navigate, setCurrentSong]);

    useEffect(() => {
        let interval: any;
        if (autoScroll) {
            interval = setInterval(() => {
                window.scrollBy({ top: 1, behavior: 'smooth' });
            }, 100);
        }
        return () => clearInterval(interval);
    }, [autoScroll]);

    const handleQuit = () => {
        socket.emit('quit_song');
        setCurrentSong(null);
        navigate('/admin');
    };

    if (!user) return <p>Loading user...</p>;
    if (!currentSong) return <p>Waiting for song...</p>;

    return (
        <div style={{
            backgroundColor: '#000',
            color: '#fff',
            padding: '2rem',
            fontSize: '1.6rem',
            lineHeight: '2.4rem',
            height: '100vh',
            overflowY: 'auto',
            direction: 'ltr',
        }}>
            <h1 style={{ textAlign: 'center', fontSize: '2rem' }}>
                {currentSong.title} - {currentSong.artist}
            </h1>

            <div
                style={{ marginTop: '2rem' }}
                dangerouslySetInnerHTML={{ __html: currentSong.contentHtml || '' }}
            />

            <button
                onClick={() => setAutoScroll(!autoScroll)}
                style={{
                    position: 'fixed',
                    bottom: '1rem',
                    right: '6rem',
                    padding: '1rem 1.5rem',
                    borderRadius: '50%',
                    backgroundColor: '#fff',
                    color: '#000',
                    fontWeight: 'bold',
                    fontSize: '1.2rem',
                    border: 'none',
                    cursor: 'pointer',
                }}
            >
                {autoScroll ? 'Stop' : 'Scroll'}
            </button>

            <button
                onClick={handleQuit}
                style={{
                    position: 'fixed',
                    bottom: '1rem',
                    right: '1rem',
                    padding: '1rem 1.5rem',
                    backgroundColor: 'red',
                    color: '#fff',
                    fontWeight: 'bold',
                    fontSize: '1rem',
                    border: 'none',
                    borderRadius: '12px',
                    cursor: 'pointer',
                }}
            >
                Quit
            </button>
        </div>
    );
};

export default LiveAdmin;
