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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.extractRawText = exports.getSongContentFromTab4U = exports.searchSongsTab4U = void 0;
const puppeteer_1 = __importDefault(require("puppeteer"));
const cheerio = require('cheerio');
// Search songs on Tab4U site using Puppeteer to automate browser
const searchSongsTab4U = (query) => __awaiter(void 0, void 0, void 0, function* () {
    const browser = yield puppeteer_1.default.launch({
        headless: true,
        args: ['--no-sandbox', '--disable-setuid-sandbox']
    });
    try {
        const page = yield browser.newPage();
        yield page.setUserAgent('Mozilla/5.0 (Windows NT 10.0; Win64; x64)');
        console.log('Navigating to Tab4U homepage...');
        yield page.goto('https://www.tab4u.com/', {
            waitUntil: 'networkidle2'
        });
        yield page.waitForSelector('#searchText', { timeout: 15000 });
        yield page.type('#searchText', query);
        yield page.waitForSelector('input[aria-label="חפש את מה שהקלדתי"]', { timeout: 10000 });
        yield Promise.all([
            page.waitForNavigation({ waitUntil: 'networkidle2' }),
            page.click('input[aria-label="חפש את מה שהקלדתי"]')
        ]);
        yield page.waitForSelector('div.ruSongUnit', { timeout: 10000 });
        // Extract song info from page DOM
        const results = yield page.evaluate(() => {
            const rows = Array.from(document.querySelectorAll('div.ruSongUnit'));
            return rows.map(row => {
                var _a, _b, _c, _d, _e, _f;
                const title = ((_b = (_a = row.querySelector('.sNameI19')) === null || _a === void 0 ? void 0 : _a.textContent) === null || _b === void 0 ? void 0 : _b.trim()) || '';
                const artist = ((_d = (_c = row.querySelector('.aNameI19')) === null || _c === void 0 ? void 0 : _c.textContent) === null || _d === void 0 ? void 0 : _d.trim()) || '';
                const relativeLink = ((_e = row.querySelector('a.ruSongLink')) === null || _e === void 0 ? void 0 : _e.getAttribute('href')) || '';
                const link = relativeLink ? `https://www.tab4u.com/${relativeLink}` : '';
                const style = ((_f = row.querySelector('.ruArtPhoto')) === null || _f === void 0 ? void 0 : _f.getAttribute('style')) || '';
                const match = style.match(/url\(['"]?(.*?)['"]?\)/);
                const image = match ? `https://www.tab4u.com${match[1]}` : '';
                return { title, artist, link, image };
            }).filter(song => song.title && song.link);
        });
        return results;
    }
    catch (error) {
        console.error('puppeteer error:', error.message);
        throw error;
    }
    finally {
        yield browser.close();
    }
});
exports.searchSongsTab4U = searchSongsTab4U;
// Fetch full song content HTML and raw text from a given song page link
const getSongContentFromTab4U = (link) => __awaiter(void 0, void 0, void 0, function* () {
    const browser = yield puppeteer_1.default.launch({
        headless: true,
        args: ['--no-sandbox', '--disable-setuid-sandbox']
    });
    try {
        const page = yield browser.newPage();
        yield page.goto(link, { waitUntil: 'networkidle2' });
        yield page.waitForSelector('#songContentTPL', { timeout: 10000 });
        const contentHtml = yield page.evaluate(() => {
            const container = document.querySelector('#songContentTPL');
            if (!container)
                return '';
            const elements = container.querySelectorAll('[onmouseover], [onmouseout], [onclick], [onmouseenter], [onmouseleave]');
            elements.forEach(el => {
                el.removeAttribute('onmouseover');
                el.removeAttribute('onmouseout');
                el.removeAttribute('onclick');
                el.removeAttribute('onmouseenter');
                el.removeAttribute('onmouseleave');
            });
            return container.innerHTML;
        });
        const $ = cheerio.load(contentHtml);
        const rawLines = [];
        $('table tr').each((_, elem) => {
            const rowText = $(elem).text().trim();
            if (rowText) {
                rawLines.push(rowText);
            }
        });
        const rawText = rawLines.join('\n');
        const chordsLines = [];
        const lyricsLines = [];
        $('table tr').each((_, elem) => {
            const chords = $(elem).find('td.chords, td.chords_en').text().trim();
            const lyrics = $(elem).find('td.song').text().trim();
            chordsLines.push(chords);
            lyricsLines.push(lyrics);
        });
        const chords = chordsLines.join('\n');
        const lyrics = lyricsLines.join('\n');
        return {
            contentHtml,
            chords,
            lyrics,
            rawText
        };
    }
    catch (error) {
        console.error('Error scraping song content:', error);
        return { contentHtml: '', chords: '', lyrics: '', rawText: '' };
    }
    finally {
        yield browser.close();
    }
});
exports.getSongContentFromTab4U = getSongContentFromTab4U;
// Extract raw text (chords and lyrics) from HTML using cheerio
const extractRawText = (html) => {
    if (!html) {
        return '';
    }
    try {
        const $ = cheerio.load(html);
        const lines = [];
        $('table tr').each((_, elem) => {
            const chords = $(elem).find('td.chords, td.chords_en').text().trim();
            const lyrics = $(elem).find('td.song').text().trim();
            if (chords || lyrics) {
                lines.push(chords);
                lines.push(lyrics);
            }
        });
        if (lines.length === 0) {
            console.warn('No lines extracted with updated selectors');
        }
        return lines.join('\n');
    }
    catch (error) {
        console.error('Failed to load HTML with cheerio:', error);
        return '';
    }
};
exports.extractRawText = extractRawText;
