import { Server as HTTPServer } from 'http';
import { Server as SocketIOServer } from 'socket.io';
import { getSongContentFromTab4U } from './songScraper';

//setup Socket.IO server with given HTTP server
export const setupSocket = (server: HTTPServer): void => {
    const io = new SocketIOServer(server, {
        cors: {
            origin: 'http://localhost:3000',
            methods: ['GET', 'POST'],
        },
    });

    console.log('Socket.IO server initialized');

    io.on('connection', (socket) => {
        console.log('Socket connected:', socket.id);

        socket.on('user_login', (data) => {
            console.log('User logged in via socket:', data);
            socket.data.user = data;
        });

        socket.on('select_song', async (songData) => {
            console.log('Admin selected song:', songData);

            try {
                const songContent = await getSongContentFromTab4U(songData.link);
                console.log('rawText length:', songContent.rawText.length);

                const fullSong = {
                    ...songData,
                    contentHtml: songContent.contentHtml,
                    rawText: songContent.rawText,
                };

                io.emit('song_selected', fullSong);
                console.log('Broadcasted full song to all users');
            } catch (error) {
                console.error('Failed to fetch full song content:', error);
                socket.emit('song_error', 'Could not load song content.');
            }
        });


        socket.on('quit_song', () => {
            console.log('Admin quit the song');
            io.emit('quit_song');
        });

        socket.on('disconnect', () => {
            console.log('Socket disconnected:', socket.id);
        });
    });
};
