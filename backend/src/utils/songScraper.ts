import puppeteer from 'puppeteer';
const cheerio = require('cheerio');

// Search songs on Tab4U site using Puppeteer to automate browser
export const searchSongsTab4U = async (query: string) => {
    const browser = await puppeteer.launch({
        headless: true,
        args: ['--no-sandbox', '--disable-setuid-sandbox']
    });

    try {
        const page = await browser.newPage();
        await page.setUserAgent('Mozilla/5.0 (Windows NT 10.0; Win64; x64)');

        console.log('Navigating to Tab4U homepage...');
        await page.goto('https://www.tab4u.com/', {
            waitUntil: 'networkidle2'
        });

        await page.waitForSelector('#searchText', { timeout: 15000 });
        await page.type('#searchText', query);

        await page.waitForSelector('input[aria-label="חפש את מה שהקלדתי"]', { timeout: 10000 });
        await Promise.all([
            page.waitForNavigation({ waitUntil: 'networkidle2' }),
            page.click('input[aria-label="חפש את מה שהקלדתי"]')
        ]);

        await page.waitForSelector('div.ruSongUnit', { timeout: 10000 });
        // Extract song info from page DOM
        const results = await page.evaluate(() => {
            const rows = Array.from(document.querySelectorAll('div.ruSongUnit'));

            return rows.map(row => {
                const title = row.querySelector('.sNameI19')?.textContent?.trim() || '';
                const artist = row.querySelector('.aNameI19')?.textContent?.trim() || '';
                const relativeLink = row.querySelector('a.ruSongLink')?.getAttribute('href') || '';
                const link = relativeLink ? `https://www.tab4u.com/${relativeLink}` : '';

                const style = row.querySelector('.ruArtPhoto')?.getAttribute('style') || '';
                const match = style.match(/url\(['"]?(.*?)['"]?\)/);
                const image = match ? `https://www.tab4u.com${match[1]}` : '';

                return { title, artist, link, image };
            }).filter(song => song.title && song.link);
        });

        return results;
    } catch (error: any) {
        console.error('puppeteer error:', error.message);
        throw error;
    } finally {
        await browser.close();
    }
};
// Fetch full song content HTML and raw text from a given song page link
export const getSongContentFromTab4U = async (link: string) => {
    const browser = await puppeteer.launch({
        headless: true,
        args: ['--no-sandbox', '--disable-setuid-sandbox']
    });

    try {
        const page = await browser.newPage();
        await page.goto(link, { waitUntil: 'networkidle2' });

        await page.waitForSelector('#songContentTPL', { timeout: 10000 });

        const contentHtml = await page.evaluate(() => {
            const container = document.querySelector('#songContentTPL');
            if (!container) return '';

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

        const rawLines: string[] = [];

        $('table tr').each((_: number, elem: any) => {
            const rowText = $(elem).text().trim();
            if (rowText) {
                rawLines.push(rowText);
            }
        });

        const rawText = rawLines.join('\n');

        const chordsLines: string[] = [];
        const lyricsLines: string[] = [];

        $('table tr').each((_: number, elem: any) => {
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
    } catch (error) {
        console.error('Error scraping song content:', error);
        return { contentHtml: '', chords: '', lyrics: '', rawText: '' };
    } finally {
        await browser.close();
    }
};



// Extract raw text (chords and lyrics) from HTML using cheerio
export const extractRawText = (html: string): string => {
    if (!html) {
        return '';
    }

    try {
        const $ = cheerio.load(html);
        const lines: string[] = [];

        $('table tr').each((_: number, elem: any) => {
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
    } catch (error) {
        console.error('Failed to load HTML with cheerio:', error);
        return '';
    }
};



