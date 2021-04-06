const puppeteer = require('puppeteer');
const fs = require('fs');
const url = 'https://myanimelist.net/anime/39783/5-toubun_no_Hanayome_%E2%88%AC/episode';
(async () => {
    const browser = await puppeteer.launch({headless : true}); //browser initiate
    const page = await browser.newPage();  // opening a new blank page
    await page.goto(url, {waitUntil : 'networkidle0'})
    const title = await (await page.$('div div.h1.edit-info div.h1-title div p')).evaluate(node => node.innerText);

    const episodeTitileElements = await page.$$('td.episode-title a.fl-l.fw-b');
    await episodeTitileElements.forEach((tag, index)=> {

        let name = tag.evaluate(node => node.innerText)
        name.then(i => {
            fs.appendFile(`${title}.md`, `Episode ${index + 1} - ${i}\n`, function (err) {
                if (err) throw err;
            })
        })
    })
    fs.appendFile('.gitignore', `\n${title}.md`, function (err) {
        if (err) throw err;
    })
    
    browser.close();
})();
