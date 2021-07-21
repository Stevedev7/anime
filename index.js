const puppeteer = require('puppeteer');
const fs = require('fs');
(async () => {
    const browser = await puppeteer.launch({headless : false}); //browser initiate
    const page = await browser.newPage();  // opening a new blank page
    await page.goto('https://myanimelist.net/anime/38101/5-toubun_no_Hanayome/episode', {waitUntil : 'networkidle0'})
    const title = await (await page.$('div div.h1.edit-info div.h1-title div p')).evaluate(node => node.innerText);

    try{
        if(fs.existsSync(`${title}.md`)){
            console.log('Already Scraped');
            process.exit();
        }
    } catch(err){
        throw err;
    }
    
    const episodeTitileElements = await page.$$('td.episode-title a.fl-l.fw-b');
    const episodeTitiles = [];
    for await (let episodeTitle of extractTitle(episodeTitileElements)){
        episodeTitiles.push(episodeTitle);
        fs.appendFile(`${title}.md`, `Episode ${episodeTitle[1] + 1} - ${episodeTitle[0]}\n`, function (err) {
            if (err) throw err;
        })
    }
    fs.appendFile('.gitignore', `\n${title}.md`, function (err) {
        if (err) throw err;
    });
    browser.close();
})();

async function* extractTitle(tags) {
    for(let i=0;i<tags.length;++i){
        let tagText = await tags[i].evaluate(tagNode => tagNode.innerText)
        yield [tagText, i];
    }
}