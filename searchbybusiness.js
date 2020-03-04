const puppeteer = require('puppeteer');
const fs = require('fs');
const csv = require('csv-parser');

const county = {
  "Brooklyn" : "KING",
  "New York": "NEW",
  "Queens": "QUEE",
  "Astoria": "QUEE",
  "Bronx": "BRON",
  "Staten Island": "RICH"

}

(async () => {
  const browser = await puppeteer.connect({
  browserWSEndpoint: 'wss://chrome.browserless.io/?token=fb656f23-16c1-4413-ab60-563b0cfb2893'
});
  //const browser = await puppeteer.launch();
  const page = await browser.newPage();
  await page.goto('https://www.tran.sla.ny.gov/JSP/query/PublicQueryPremisesSearchPage.jsp');

  await page.screenshot({path: 'example.png'});

  await browser.close();
})();