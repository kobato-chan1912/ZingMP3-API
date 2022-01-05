var express = require('express');
var app = express();
const crypto = require('crypto');
const puppeteer = require('puppeteer');
const superagent = require('superagent');
// 

// Hello World Testing //  

app.use(function (req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    next();
});

app.get('/', function (req, res) {
    res.send('hello world')
})


//  Route for Getting Song Detail // 
//  Method: Get
//  Endpoint: api/getSong/:ID
//  {
//     Response: 
//     status: 200,
//     title:,
//     artist:, 
//     lyrics:, 
//     cover:,
//     streaming: 
//  }

app.get('/api/getSong/:ID', (req, res) => {

    (async () => {

        var zingID = req.params.ID;
        var ctime = 1620490720;
        var apiKey = "38e8643fb0dc04e8d65b99994d3dafff"; // You can use your Api Key. 


        const getHash256 = (a) => {
            return crypto.createHash('sha256').update(a).digest('hex');
        }
        const getHmac512 = (str, key) => {
            let hmac = crypto.createHmac("sha512", key);
            return hmac.update(Buffer.from(str, 'utf8')).digest("hex");
        }

        var sig = getHmac512('/song/get-song-info' + getHash256(`ctime=${ctime}id=${zingID}`), '10a01dcf33762d3a204cb96429918ff6');

        var url = `https://zingmp3.vn/api/song/get-song-info?id=${zingID}&ctime=${ctime}&sig=${sig}&api_key=${apiKey}`

        // var browser = await puppeteer.launch({
        //     headless: false,
        //     args: ['--no-sandbox']
        // });
        const browser = await puppeteer.connect({
            browserWSEndpoint:
                'wss://proxy.0browser.com?token=5e2f1670-0146-4e11-8d53-e5c9315d5aca&timeout=60000',
        });

        // const browser = await puppeteer.connect({
        //     browserWSEndpoint: 'wss://chrome.browserless.io/'
        //   });




        const page = await browser.newPage();

        await page.goto(url);

        var content = await page.content();

        innerText = await page.evaluate(() => {
            return JSON.parse(document.querySelector("body").innerText);
        });

        console.log("Response received");

        if (innerText.err == -201) { // Error Ctime.

            await page.reload();
            innerText = await page.evaluate(() => {
                return JSON.parse(document.querySelector("body").innerText);
            });
            console.log(innerText);

            // if not found data.
            if (innerText.err == -105) { // data not found. 
                res.json({
                    status: 404
                });
            }
            else { // data found                  
                let streaming = `http://api.mp3.zing.vn/api/streaming/audio/${req.params.ID}/320`;
                res.json({
                    status: 200,
                    title: innerText.data.title, artist: innerText.data.artists_names, lyrics:
                        innerText.data.lyric, cover: innerText.data.thumbnail_medium,
                    streaming: streaming
                });
            }
        }

        //  Close headless browser...

        await browser.close();



    })
        ();



});

const port = process.env.PORT || 3000; // You can change your port

app.listen(port, function () {
    console.log('API Available on Port 3000!');
});
