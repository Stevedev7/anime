const puppeteer = require('puppeteer');

(async () => {
    const browser = await puppeteer.launch({headless : false}); //browser initiate
    const page = await browser.newPage();  // opening a new blank page
    await page.goto('https://myanimelist.net/anime/38101/5-toubun_no_Hanayome/episode', {waitUntil : 'networkidle0'})
    const title = await (await page.$('div div.h1.edit-info div.h1-title div p')).evaluate(node => node.innerText);
    console.log(title);

    const episodeTitileElements = await page.$$('td.episode-title a.fl-l.fw-b');
    const episodeTitiles = [];
    await episodeTitileElements.forEach(tag => {

        let name = tag.evaluate(node => node.innerText)
        name.then(i => console.log(i))
    })
    browser.close();
})();
