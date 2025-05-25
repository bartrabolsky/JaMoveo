import React, { useEffect, useState } from 'react';
import { useSong } from '../context/SongContext';
import { useNavigate } from 'react-router-dom';
import { socket } from '../services/socket';
import { useUser } from '../hooks/useUser';

const LiveAdmin = () => {
    const { currentSong, setCurrentSong } = useSong();
    console.log('currentSong:', currentSong);
    const { user } = useUser();
    const navigate = useNavigate();
    const [autoScroll, setAutoScroll] = useState(false);
    // Listen for 'song_selected' event to update current song
    useEffect(() => {
        socket.on('song_selected', (songData) => {
            setCurrentSong(songData);
        });
        return () => {
            socket.off('song_selected');
        };
    }, [setCurrentSong]);
    // Listen for 'quit_song' event to clear current song and navigate back
    useEffect(() => {
        socket.on('quit_song', () => {
            setCurrentSong(null);
            navigate('/admin');
        });
        return () => {
            socket.off('quit_song');
        };
    }, [navigate, setCurrentSong]);
    // Handle auto-scrolling when enabled
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

    // if (!user) return <p className="text-center text-white mt-10">Loading user...</p>;
    if (!currentSong) return <p className="text-center text-white mt-10">Waiting for song...</p>;

    return (
        // Page styling
        <div
            className="min-h-screen text-white p-6 overflow-y-auto font-sans text-base sm:text-lg"
            style={{
                direction: 'rtl',
                lineHeight: 1.6,
                whiteSpace: 'pre-wrap',
                background: `
                  linear-gradient(135deg, #1f2937 0%, #3b4252 100%),
                  repeating-radial-gradient(circle at 0 0, #2c3e50 0, #2c3e50 2px, #1f2937 3px, #1f2937 5px)
                `,
                backgroundBlendMode: 'overlay',
                backgroundRepeat: 'no-repeat',
                backgroundAttachment: 'fixed',
            }}
        >
            <div className="max-w-4xl mx-auto">
                <h1 className="text-3xl font-extrabold text-center mb-6 tracking-wide text-yellow-400 border-b border-gray-600 pb-4 select-none">
                    {currentSong.title} / {currentSong.artist}
                </h1>

                {currentSong.rawText ? (
                    <pre
                        style={{
                            fontFamily: '"Fira Mono", monospace',
                            fontSize: '1.1rem',
                            lineHeight: '1.8rem',
                            marginBottom: '4rem',
                            direction: 'rtl',
                            textAlign: 'right',
                            color: '#eee',
                            whiteSpace: 'pre-wrap',
                            letterSpacing: '0.05em',
                        }}
                    >
                        {currentSong.rawText.split('\n').map((line, idx) => {
                            if (idx % 2 === 0) {
                                return (
                                    <div key={idx} style={{ color: '#00e5ff', fontWeight: '700' }}>
                                        {line}
                                    </div>
                                );
                            } else {
                                return <div key={idx}>{line}</div>;
                            }
                        })}
                    </pre>
                ) : (
                    <p className="text-center text-gray-400 mt-6">אין תוכן לשיר</p>
                )}
            </div>

            <div className="fixed bottom-6 left-0 right-0 flex justify-center gap-6 px-4">
                <div className="fixed bottom-6 left-0 right-0 flex justify-center gap-6 px-4">
                    <button
                        onClick={() => setAutoScroll(!autoScroll)}
                        className="bg-gray-300 text-black font-semibold text-base rounded-md px-10 py-3 shadow-md hover:bg-gray-400 transition-transform transform active:scale-95"
                        aria-label={autoScroll ? 'Stop automatic scrolling' : 'Start automatic scrolling'}
                    >
                        {autoScroll ? 'Stop' : 'Scroll'}
                    </button>

                    <button
                        onClick={handleQuit}
                        className="bg-red-600 hover:bg-red-700 text-white font-semibold text-base rounded-md px-10 py-3 shadow-md transition-transform transform active:scale-95"
                        aria-label="Quit rehearsal"
                    >
                        Quit
                    </button>
                </div>
            </div>
        </div>
    );
};

export default LiveAdmin;
