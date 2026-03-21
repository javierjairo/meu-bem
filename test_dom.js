import puppeteer from 'puppeteer';

(async () => {
    const browser = await puppeteer.launch({ headless: "new" });
    const page = await browser.newPage();
    await page.goto('http://localhost:5173/gallery', { waitUntil: 'networkidle2' });
    
    // Pega o HTML da track do carousel
    const html = await page.evaluate(() => {
        const track = document.querySelector('div[style*="perspective: 1200px"]');
        if (!track) return 'No track found';
        
        let dump = track.outerHTML.substring(0, 1000);
        return `Track HTML snippet:\n${dump}\n\nChildren count: ${track.children.length}`;
    });
    
    console.log(html);
    await browser.close();
})();
