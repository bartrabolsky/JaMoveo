import React, { createContext, useContext, useState, useEffect } from 'react';
import { socket } from '../socket';

type Song = {
    rawText: string;
    title: string;
    artist: string;
    link: string;
    image?: string;
    lyrics?: string;
    chords?: string;
    contentHtml?: string;
} | null;

type SongContextType = {
    currentSong: Song;
    setCurrentSong: (song: Song) => void;
};

const SongContext = createContext<SongContextType | undefined>(undefined);

export const SongProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [currentSong, setCurrentSong] = useState<Song>(null);

    useEffect(() => {
        socket.on('song_selected', (song: Song) => {
            setCurrentSong(song);
        });

        socket.on('quit_song', () => {
            setCurrentSong(null);
        });

        return () => {
            socket.off('song_selected');
            socket.off('quit_song');
        };
    }, []);

    return (
        <SongContext.Provider value={{ currentSong, setCurrentSong }}>
            {children}
        </SongContext.Provider>
    );
};

export const useSong = () => {
    const context = useContext(SongContext);
    if (!context) {
        throw new Error('useSong must be used within a SongProvider');
    }
    return context;
};
