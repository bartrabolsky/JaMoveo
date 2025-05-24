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
        socket.on('song_selected', (song) => {
            setCurrentSong(song);
        });

        socket.on('quit_song', () => {
            setCurrentSong(null);
            navigate('/player');
        });

        return () => {
            socket.off('song_selected');
            socket.off('quit_song');
        };
    }, [navigate, setCurrentSong]);

    useEffect(() => {
        if (!currentSong) {
            navigate('/player');
        }
    }, [currentSong, navigate]);

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

    const contentStyle = `
    .chord { color: #3b82f6; font-weight: bold; }
    .lyrics { color: #ffffff; }
    pre, code {
      font-family: monospace;
      white-space: pre-wrap;
      line-height: 1.8rem;
      font-size: 1.2rem;
      margin: 0;
    }
  `;

    function extractLyricsOnly(html: string): string {
        try {
            const parser = new DOMParser();
            const doc = parser.parseFromString(html, 'text/html');

            const lyricsElements = doc.querySelectorAll('.lyrics');
            if (lyricsElements.length > 0) {
                let lyricsHtml = '';
                lyricsElements.forEach((el) => {
                    lyricsHtml += el.outerHTML;
                });
                return lyricsHtml;
            }
            return doc.body.textContent || '';
        } catch {
            return html;
        }
    }

    return (
        <div
            style={{
                backgroundColor: '#000',
                color: '#fff',
                padding: '2rem',
                fontSize: '1.6rem',
                lineHeight: '2.4rem',
                height: '100vh',
                overflowY: 'auto',
                direction: 'rtl',
                textAlign: 'right',
                fontFamily: 'monospace',
            }}
        >
            <style>{contentStyle}</style>

            <h1 style={{ textAlign: 'center', fontSize: '2rem', marginBottom: '2rem' }}>
                {currentSong.title} - {currentSong.artist}
            </h1>

            {isSinger ? (
                <div
                    dangerouslySetInnerHTML={{
                        __html: extractLyricsOnly(currentSong.contentHtml || ''),
                    }}
                />
            ) : (
                <div dangerouslySetInnerHTML={{ __html: currentSong.contentHtml || '' }} />
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
