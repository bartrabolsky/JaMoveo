import { Request, Response } from 'express';
import { searchSongsTab4U, getSongContentFromTab4U } from '../utils/songScraper';

export const searchSongs = async (req: Request, res: Response): Promise<void> => {
    const query = req.query.query as string;

    if (!query) {
        res.status(400).json({ error: 'Missing query parameter' });
        return;
    }

    try {
        const songs = await searchSongsTab4U(query);
        if (songs.length === 0) {
            res.status(404).json({ message: 'No songs found' });
            return;
        }
        res.json(songs);
    } catch (error) {
        console.error('Tab4U search failed:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
};

export const getSongContent = async (req: Request, res: Response): Promise<void> => {
    const link = req.query.link as string;

    if (!link) {
        res.status(400).json({ error: 'Missing link parameter' });
        return;
    }

    try {
        const songContent = await getSongContentFromTab4U(link);
        res.json(songContent);
    } catch (error) {
        console.error('Failed to fetch song content:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
};
