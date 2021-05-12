const fs = require('fs');

const scraperObject = {
    url: 'https://zingmp3.vn/bai-hat/Nguoi-Ta-Dau-Thuong-Em-LyLy/ZO89BOBW.html',
    async scraper(browser) {


        let page = await browser.newPage();
        // set time out. 
        await page.setDefaultNavigationTimeout(0);

        console.log(`Navigating to ${this.url}...`);
        // Navigate to the selected page

        // load cookies 

        // ... puppeteer code


        
        await page.goto(this.url);




        // get all requests here

        //         page.setRequestInterception(true);
        //         page.on('request', (request) => {
        //         //   if (request.resourceType() === 'xhr') {
        //             if (request.url().includes("song/getStreaming")){
        //                 console.log(request.url())
        // 
        //                 // read request 
        //                 page.on('response', async (response) => {    
        //                     if (response.url() == request.url()){
        //                         console.log('XHR response received'); 
        //                         console.log(await response.json()); 
        //                     } 
        //                 }); 
        //                 
        //             }
        //         //   }
        //           request.continue();
        //         });




        // Wait for the required DOM to be rendered

        // await page.waitForSelector('.page_inner');

        // Get the link to all the required books
        // let urls = await page.$$eval('section ol > li', links => {
        //     // Make sure the book to be scraped is in stock
        //     links = links.filter(link => link.querySelector('.instock.availability > i').textContent !== "In stock")
        //     // Extract the links from the data
        //     links = links.map(el => el.querySelector('h3 > a').title)
        //     return links;
        // });

        //         let titles = await page.$$eval('#automation_TV0  > article', titlePages => {
        //             
        //             titlePages = titlePages.map(el => el.querySelector('h3 > a').title);
        //             return titlePages;
        // 
        //         });
        // 
        //         let comments = await page.$$eval("#list_comment > div", comment => {
        //             comment = comment.map(el => el.querySelector('.content-comment > p').innerText);
        //             return comment;
        //         });
        //         console.log(comments);
    }
}

module.exports = scraperObject;