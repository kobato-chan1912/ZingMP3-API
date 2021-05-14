var express = require('express');
var app = express();
const crypto = require('crypto');
const puppeteer = require('puppeteer');
const superagent = require('superagent');
// 

// testing hello world. 

app.use(function(req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    next();
});

app.get('/', function (req, res) {
    res.send('hello world')
})

//   app.get('/getStreaming/:ID', function (req, res) {
//     (async () => {
//         const browser = await puppeteer.launch({ headless: false });
//         let page = await browser.newPage();
//         let url = 'https://google.com';
//         let count_request = 0;
// 
//         // set time out. 
//         await page.setDefaultNavigationTimeout(0);
// 
//         console.log(`Navigating to ${url}...`);
//         page.setRequestInterception(true);
//         page.on('request', (request) => {
//             request.continue();
//         });
//         await page.goto(url);
// 
//         if (count_request == 0) {
//             res.json({ status: 'ID not found or Something wrong..' })
//             await browser.close();
//         }
// 
// 
// 
//     })();
// 
// });
// app.get('/getDetail/:ID', function (req, res) {
//     (async () => {
//         const browser = await puppeteer.launch({ headless: false });
//         let page = await browser.newPage();
//         let url = 'https://zingmp3.vn/bai-hat/' + req.params.ID + '.html';
//         let count_request = 0;
// 
//         // set time out. 
//         await page.setDefaultNavigationTimeout(0);
// 
//         console.log(`Navigating to ${url}...`);
//         page.setRequestInterception(true);
//         page.on('request', (request) => {
// 
// 
//         //   if (request.resourceType() === 'xhr') {
//         
//             if (request.url().includes("song/getDetail")){
//                 count_request++;
//                 // read request 
//                 page.on('response', async (response) => {    
//                     if (response.url() == request.url()){
//                         console.log('Streaming response received'); 
//                         res.send(await response.json()); 
//                     } 
//                 }); 
//                 
//             }
//         //   }
//           request.continue();
//         });
//         await page.goto(url);
// 
//         if (count_request == 0){
//             res.json({status: 'ID not found or Something wrong.'})
//             await browser.close();
//         }
//         
// 
// 
//       })();
//       
// });
// 
// app.get('/getLyric/:ID', function (req, res) {
//     (async () => {
//         const browser = await puppeteer.launch({ headless: false });
//         let page = await browser.newPage();
//         let url = 'https://zingmp3.vn/bai-hat/' + req.params.ID + '.html';
//         let count_request = 0;
// 
// 
//         // set time out. 
//         await page.setDefaultNavigationTimeout(0);
// 
//         console.log(`Navigating to ${url}...`);
//         
// 
//         page.setRequestInterception(true);
// 
//         page.on('request', (request) => {
// 
// 
//         //   if (request.resourceType() === 'xhr') {
//         
//             if (request.url().includes("v2/lyric")){
//                 count_request++;
//                 // read request 
//                 page.on('response', async (response) => {   
// 
//                     
// 
//                     if (response.url() == request.url()){
//                         console.log('Streaming response received'); 
//                         res.send(await response.json()); 
//                         await browser.close()
//                 }
//                 }); 
//                 
//             }
//         //   }
//           request.continue();
//         });
//         await page.goto(url, { waitUntil: 'networkidle2' });
//         // let selector = 'i[class="icon ic-karaoke"]';
//         // if (selector){
//         // await page.evaluate((selector) => document.querySelector(selector).click(), selector); 
//         // }
//         // else{
//         //     res.json({status: 'ID not found.'})
//         //     await browser.close();
//         // }
// 
//         const selector = 'i[class="icon ic-karaoke"]';
//         try {
//             if (selector)
//                 await page.evaluate((selector) => document.querySelector(selector).click(), selector); 
//         } catch {
//             res.json({status: 'ID not found or Something wrong.'});
//             await browser.close();
//         }
//     
//         
// 
// 
//       })();
//       
// });


//  crypto zing mp3 lyrics.


app.get('/api/getSong/:ID', (req, res) => {

    (async () => {

        var zingID = req.params.ID;
        var ctime = 1620490720;
        var apiKey = "38e8643fb0dc04e8d65b99994d3dafff";


        const getHash256 = (a) => {
            return crypto.createHash('sha256').update(a).digest('hex');
        }
        const getHmac512 = (str, key) => {
            let hmac = crypto.createHmac("sha512", key);
            return hmac.update(Buffer.from(str, 'utf8')).digest("hex");
        }

        var sig = getHmac512('/song/get-song-info' + getHash256(`ctime=${ctime}id=${zingID}`), '10a01dcf33762d3a204cb96429918ff6');

        var url = `https://zingmp3.vn/api/song/get-song-info?id=${zingID}&ctime=${ctime}&sig=${sig}&api_key=${apiKey}`

        // const browser = await puppeteer.launch({
        //     headless: false  //change to true in prod!
        // });

        const browser = await puppeteer.connect({  browserWSEndpoint: 'wss://chrome.browserless.io/' }).catch((err) => console.log('caught it'));;
        const page = await browser.newPage().catch((err) => console.log('caught it'));;
        await page.goto(url).catch((err) => console.log('caught it'));;

        var content = await page.content().catch((err) => console.log('caught it'));;

        innerText = await page.evaluate(() => {
            return JSON.parse(document.querySelector("body").innerText);
        }).catch((err) => console.log('caught it'));

        console.log("Response received");

        if (innerText.err == -201) { // error ctime.

            await page.reload().catch((err) => console.log('caught it'));;
            innerText = await page.evaluate(() => {
                return JSON.parse(document.querySelector("body").innerText);
            }).catch((err) => console.log('caught it'));
            console.log(innerText);

            // if not found data.
            if (innerText.err == -105) { // data not found. 
                res.json({
                    status: 404
                });
            }
            else { // data found                  
                let streaming = `http://api.mp3.zing.vn/api/streaming/audio/${req.params.ID}/320`;
                res.json({ status: 200,
                    title: innerText.data.title, artist: innerText.data.artists_names, lyrics:
                        innerText.data.lyric, cover: innerText.data.thumbnail_medium, 
                        streaming: streaming
                });
            }
        }




        //I will leave this as an excercise for you to
        //  write out to FS...

        await browser.close().catch((err) => console.log('caught it'));;



    })
        ();



});

const port = process.env.PORT || 3000;

app.listen(port, function () {
    console.log('Example app listening on port 3000!');
    
});
