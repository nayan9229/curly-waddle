const puppeteer = require('puppeteer');
const fs = require('fs')
const secondsForExtensionToLoad = 1
// const CRX_PATH = './browser-extension'
// const CRX_PATH = './jsonviever'
const CRX_PATH = require('path').join(__dirname, 'browser-extension');

// (async () => {
//   const browser = await puppeteer.launch();
//   const page = await browser.newPage();
//   await page.goto('https://news.ycombinator.com', {waitUntil: 'networkidle2'});
//   await page.pdf({path: 'hn.pdf', format: 'A4'});

//   await browser.close();
// })();

// const urls = [
//     'https://www.amazon.com',
//     'https://example.com',
//     'https://gov.uk',
//     'https://loc.gov',
//     'https://twitter.com',
//     'https://wikipedia.org'
// ];

// const allResults = [];

// (async () => {
//     let browser = await setup() // acquire puppeteer browser object
//     for (let url of urls) {
//         try {
//             let pages = await browser.pages() // get list of tabs
//             let targetPage = pages[0] // initially the default empty tab
//             await targetPage.goto(url) // load the url
//             await waitSeconds(2) // let it breathe
//             await targetPage.evaluate(() => {
//                 // this block runs in the browser
//                 const vlbc = document.getElementById('viewLinksButtonContainer')
//                 const shadow = vlbc.shadowRoot
//                 const button = shadow.querySelector('button')
//                 button.click()
//             })
//             await waitSeconds(2) // let it breathe
//             pages = await browser.pages()
//             let viewPage = pages[1] // go to the 2nd tab opened by the button click
//             const message = new Date().toISOString() // make arbitrary input
//             const results = await viewPage.evaluate((message) => {
//                 // this blocks run in the browser's 2nd tab
//                 const data = JSON.parse(document.querySelector('pre').innerText) // rehydrate the data
//                 const doneContainerRoot = document.getElementById('doneButtonContainer').shadowRoot
//                 const button = doneContainerRoot.querySelector('button')
//                 const input = doneContainerRoot.querySelector('input')
//                 input.value = message // satisfy the input requirement
//                 button.click()
//                 return Promise.resolve(data) // send data back to puppeteer
//             }, message) // you have to put 'message' at the end too
//             allResults.push(results)
//             await waitSeconds(2) // let it breathe
//         } catch (error) {
//             console.log(error);
//         }
//     }
//     console.log(JSON.stringify(allResults, null, 2));
//     await browser.close() // all done
// })();

const urls = [`https://reqres.in/api/users`, `http://dummy.restapiexample.com/api/v1/employees`];

(async () => {
    let browser = await setup();
    let count = 1;
    for (const url of urls) {
        try {
            let pages = await browser.pages() // get list of tabs
            let targetPage = pages[0] // initially the default empty tab
            await targetPage.setViewport({
                width: 1024,
                height: 768,
                deviceScaleFactor: 1,
              })
            await targetPage.goto(url, { waitUntil: 'networkidle2' }) // load the url
            await waitSeconds(5) // let it breathe
            await targetPage.screenshot({ path: `./screenshot/json_${count}.png` });
            await browser.close();
            console.log('[Done]', `DONE ${count}`);
            count += 1;

        } catch (e) {
            console.log(e);
        }
    }
})();

// in this environment some things need to pause
async function waitSeconds(seconds) {
    function delay(seconds) {
        return new Promise((resolve) => setTimeout(resolve, seconds * 1000))
    }
    await delay(seconds)
}

// create a puppeteer object 
async function setup() {
    let browser = await puppeteer.launch({
        headless: false, // remain interactive
        args: [
            `--disable-extensions-except=${CRX_PATH}`,
            `--load-extension=${CRX_PATH}`,
            // '--enable-devtools-experiments' // useful for sniffing the chrome devtools protocol
            `--no-sandbox`,
            `--disable-setuid-sandbox`
        ]
    })
    await waitSeconds(secondsForExtensionToLoad) // give extension time to load
    return browser
}
