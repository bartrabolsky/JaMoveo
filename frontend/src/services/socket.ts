import { io, Socket } from 'socket.io-client';

const URL = process.env.REACT_APP_API_URL;

export const socket: Socket = io(URL, {
    autoConnect: false,
});
