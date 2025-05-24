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

    if (!user) return <p className="text-center text-white mt-10">Loading user...</p>;
    if (!currentSong) return <p className="text-center text-white mt-10">Waiting for song...</p>;

    const contentStyle = `
    .chord { color: #3b82f6; font-weight: bold; } /* כחול בהיר */
    .lyrics { color: #ffffff; }
    pre, code {
      font-family: monospace;
      white-space: pre-wrap;
      line-height: 1.8rem;
      font-size: 1.2rem;
      margin: 0;
    }
  `;



    return (
        <div
            className="min-h-screen bg-black text-white p-6 overflow-y-auto font-mono text-base sm:text-lg"
            style={{ direction: 'ltr', lineHeight: 1.3, whiteSpace: 'pre-line' }}
        >
            <div className="max-w-4xl mx-auto">
                <h1 className="text-2xl sm:text-3xl font-bold text-center mb-6 tracking-normal">
                    {currentSong.title} - {currentSong.artist}
                </h1>

                <div
                    dangerouslySetInnerHTML={{ __html: currentSong.contentHtml || '' }}
                />
            </div>

            <div className="fixed bottom-6 left-0 right-0 flex justify-center gap-6 px-4">
                <button
                    onClick={() => setAutoScroll(!autoScroll)}
                    className="bg-white text-black font-bold text-lg rounded-full px-6 py-3 shadow-lg hover:bg-gray-200 transition"
                    aria-label={autoScroll ? 'Stop automatic scrolling' : 'Start automatic scrolling'}
                >
                    {autoScroll ? 'Stop' : 'Scroll'}
                </button>

                <button
                    onClick={handleQuit}
                    className="bg-red-600 hover:bg-red-700 text-white font-bold text-base rounded-xl px-6 py-3 shadow-lg transition"
                    aria-label="Quit rehearsal"
                >
                    Quit
                </button>
            </div>
        </div>

    );
};

export default LiveAdmin;
