import React, { useEffect, useState, useRef } from 'react';
import { useUser } from '../hooks/useUser';
import { useNavigate } from 'react-router-dom';
import { socket } from '../services/socket';
import { useSong, Song } from '../context/SongContext';

const LivePlayer = () => {
    const { currentSong, setCurrentSong } = useSong();
    const { user } = useUser();
    const navigate = useNavigate();
    const [autoScroll, setAutoScroll] = useState(false);
    const scrollContainerRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const handler = (song: Song | null) => {
            if (!song) return;
            console.log('User got song_selected:', song);
            setCurrentSong({
                ...song,
                rawText: song.rawText ?? '',
            });
        };

        socket.on('song_selected', handler);

        return () => {
            socket.off('song_selected', handler);
        };
    }, [setCurrentSong]);

    useEffect(() => {
        const quitHandler = () => {
            setCurrentSong(null);
            navigate('/player');
        };
        socket.on('quit_song', quitHandler);
        return () => {
            socket.off('quit_song', quitHandler);
        };
    }, [navigate, setCurrentSong]);

    useEffect(() => {
        if (!currentSong) {
            navigate('/player');
        }
    }, [currentSong, navigate]);

    useEffect(() => {
        let interval: any;
        if (autoScroll && scrollContainerRef.current) {
            interval = setInterval(() => {
                scrollContainerRef.current!.scrollBy({ top: 1, behavior: 'smooth' });
            }, 100);
        }
        return () => clearInterval(interval);
    }, [autoScroll]);

    if (!currentSong || !user) return <p>Loading...</p>;

    const isVocals = user.instrument === 'vocals';

    return (
        <div
            ref={scrollContainerRef}
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
                color: '#eee',
                padding: '2rem',
                height: '100vh',
                overflowY: 'auto',
                textAlign: 'right',
                position: 'relative',
            }}
        >
            <div className="max-w-4xl mx-auto">
                <h1 className="text-3xl font-extrabold text-center mb-6 tracking-wide text-yellow-400 border-b border-gray-600 pb-4 select-none">
                    {currentSong.title} / {currentSong.artist}
                </h1>

                {(currentSong.chords || currentSong.lyrics) ? (
                    <div style={{ fontFamily: '"Fira Mono", monospace', fontSize: '1.1rem', lineHeight: '1.8rem', marginBottom: '4rem' }}>
                        {isVocals ? (
                            (currentSong.lyrics ?? '').split('\n').map((line, idx) => (
                                <div key={idx} style={{ padding: '2px 0' }}>
                                    {line}
                                </div>
                            ))
                        ) : (
                            (currentSong.chords ?? '').split('\n').map((chordLine, idx) => (
                                <div key={`chord-${idx}`} style={{ color: '#00e5ff', fontWeight: '700', padding: '2px 0' }}>
                                    {chordLine}
                                    <br />
                                    <span style={{ color: '#eee', fontWeight: 'normal' }}>
                                        {(currentSong.lyrics ?? '').split('\n')[idx] || ''}
                                    </span>
                                </div>
                            ))
                        )}
                    </div>
                ) : (
                    <p className="text-center text-gray-400 mt-6">אין תוכן לשיר</p>
                )}
            </div>

            <div className="fixed bottom-6 left-0 right-0 flex justify-center gap-6 px-4">
                <button
                    onClick={() => setAutoScroll(!autoScroll)}
                    className="bg-gray-300 text-black font-semibold text-base rounded-md px-10 py-3 shadow-md hover:bg-gray-400 transition-transform transform active:scale-95"
                    aria-label={autoScroll ? 'Stop automatic scrolling' : 'Start automatic scrolling'}
                >
                    {autoScroll ? 'Stop' : 'Scroll'}
                </button>
            </div>
        </div>
    );

};
export default LivePlayer;
