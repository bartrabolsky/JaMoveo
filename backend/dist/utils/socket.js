"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.setupSocket = void 0;
const socket_io_1 = require("socket.io");
const songScraper_1 = require("./songScraper");
//setup Socket.IO server with given HTTP server
const setupSocket = (server) => {
    const io = new socket_io_1.Server(server, {
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
        socket.on('select_song', (songData) => __awaiter(void 0, void 0, void 0, function* () {
            try {
                const songContent = yield (0, songScraper_1.getSongContentFromTab4U)(songData.link);
                const fullSong = Object.assign(Object.assign({}, songData), { contentHtml: songContent.contentHtml, rawText: songContent.rawText });
                io.emit('song_selected', fullSong);
            }
            catch (error) {
                console.error('Failed to fetch full song content:', error);
                socket.emit('song_error', 'Could not load song content.');
            }
        }));
        socket.on('quit_song', () => {
            io.emit('quit_song');
        });
        socket.on('disconnect', () => {
            console.log('Socket disconnected:', socket.id);
        });
    });
};
exports.setupSocket = setupSocket;
