import { Server as HTTPServer } from 'http';
import { Server as SocketIOServer } from 'socket.io';
import { getSongContentFromTab4U } from './songScraper';

//setup Socket.IO server with given HTTP server
export const setupSocket = (server: HTTPServer): void => {
    const io = new SocketIOServer(server, {
        cors: {
            origin: '*',
            methods: ['GET', 'POST'],
            credentials: true
        },
    });

    io.on('connection', (socket) => {
        console.log('Socket connected:', socket.id);

        socket.on('user_login', (data) => {
            console.log('User logged in via socket:', data);
            socket.data.user = data;
        });

        socket.on('select_song', async (songData) => {
            try {
                const songContent = await getSongContentFromTab4U(songData.link);

                const fullSong = {
                    ...songData,
                    contentHtml: songContent.contentHtml,
                    rawText: songContent.rawText,
                    chords: songContent.chords,    // <-- הוסף את זה
                    lyrics: songContent.lyrics,    // <-- ואת זה
                };

                io.emit('song_selected', fullSong);
            } catch (error) {
                console.error('Failed to fetch full song content:', error);
                socket.emit('song_error', 'Could not load song content.');
            }
        });



        socket.on('quit_song', () => {
            io.emit('quit_song');
        });

        socket.on('disconnect', () => {
            console.log('Socket disconnected:', socket.id);
        });
    });
};
