import { Server as HTTPServer } from 'http';
import { Server as SocketIOServer } from 'socket.io';

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

        socket.on('disconnect', () => {
            console.log('Socket disconnected:', socket.id);
        });
    });
};
