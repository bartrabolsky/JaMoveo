import express from 'express';
import { searchSongs, getSongContent } from '../controllers/songController';

const router = express.Router();

router.get('/search-songs', searchSongs);
router.get('/get-song-content', getSongContent);

export default router;
