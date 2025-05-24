import puppeteer from 'puppeteer';

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

        console.log(`puppeteer found ${results.length} results`);
        console.log("First result:", results[0]);
        return results;
    } catch (error: any) {
        console.error('puppeteer error:', error.message);
        throw error;
    } finally {
        await browser.close();
    }
};

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

        return {
            contentHtml,
        };
    } catch (error) {
        console.error('Error scraping song content:', error);
        return { contentHtml: '' };
    } finally {
        await browser.close();
    }
};
