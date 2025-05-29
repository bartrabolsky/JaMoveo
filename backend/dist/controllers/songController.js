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
exports.getSongContent = exports.searchSongs = void 0;
const songScraper_1 = require("../utils/songScraper");
const searchSongs = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const query = req.query.query;
    if (!query) {
        res.status(400).json({ error: 'Missing query parameter' });
        return;
    }
    try {
        const songs = yield (0, songScraper_1.searchSongsTab4U)(query);
        if (songs.length === 0) {
            res.status(404).json({ message: 'No songs found' });
            return;
        }
        res.json(songs);
    }
    catch (error) {
        console.error('Tab4U search failed:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});
exports.searchSongs = searchSongs;
const getSongContent = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const link = req.query.link;
    if (!link) {
        res.status(400).json({ error: 'Missing link parameter' });
        return;
    }
    try {
        const songContent = yield (0, songScraper_1.getSongContentFromTab4U)(link);
        res.json(songContent);
    }
    catch (error) {
        console.error('Failed to fetch song content:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});
exports.getSongContent = getSongContent;
