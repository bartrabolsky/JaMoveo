import React, { useEffect, useState } from 'react';
import { useSong } from '../context/SongContext';
import { useUser } from '../useUser';
import { useNavigate } from 'react-router-dom';
import { socket } from '../socket';

const LivePlayer = () => {
    const { currentSong, setCurrentSong } = useSong();
    const { user } = useUser();
    const navigate = useNavigate();
    const [autoScroll, setAutoScroll] = useState(false);

    useEffect(() => {
        if (!currentSong) {
            navigate('/player');
        }

        socket.on('quit_song', () => {
            setCurrentSong(null);
            navigate('/player');
        });

        return () => {
            socket.off('quit_song');
        };
    }, [currentSong, navigate, setCurrentSong]);

    useEffect(() => {
        let interval: any;
        if (autoScroll) {
            interval = setInterval(() => {
                window.scrollBy({ top: 1, behavior: 'smooth' });
            }, 100);
        }
        return () => clearInterval(interval);
    }, [autoScroll]);

    if (!currentSong || !user) return <p>Loading...</p>;

    const isSinger = user.instrument.toLowerCase() === 'vocals';
    const lyricsLines = currentSong.lyrics?.split('\n') || [];
    const chordsLines = currentSong.chords?.split('\n') || [];
    const maxLines = Math.max(lyricsLines.length, chordsLines.length);

    return (
        <div style={{
            backgroundColor: '#000',
            color: '#fff',
            padding: '2rem',
            fontSize: '1.6rem',
            lineHeight: '2.4rem',
            height: '100vh',
            overflowY: 'auto',
        }}>
            <h1 style={{ textAlign: 'center', fontSize: '2rem' }}>
                {currentSong.title} - {currentSong.artist}
            </h1>

            {isSinger ? (
                <div style={{ whiteSpace: 'pre-wrap', marginTop: '2rem', direction: 'rtl' }}>
                    {lyricsLines.join('\n')}
                </div>
            ) : (
                <div style={{ marginTop: '2rem', direction: 'rtl' }}>
                    {Array.from({ length: maxLines }).map((_, i) => (
                        <div key={i} style={{ marginBottom: '1.2rem' }}>
                            <div style={{
                                fontFamily: 'monospace',
                                whiteSpace: 'pre',
                                color: '#00f',
                                fontWeight: 'bold',
                            }}>
                                {chordsLines[i] || ''}
                            </div>
                            <div style={{
                                fontFamily: 'inherit',
                                whiteSpace: 'pre',
                            }}>
                                {lyricsLines[i] || ''}
                            </div>
                        </div>
                    ))}
                </div>
            )}

            <button
                onClick={() => setAutoScroll(!autoScroll)}
                style={{
                    position: 'fixed',
                    bottom: '1rem',
                    right: '1rem',
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
        </div>
    );
};

export default LivePlayer;
