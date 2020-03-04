const puppeteer = require('puppeteer');

nyczips = [10453,10457,10460,10458,10467,10468,10451,10452,10456,10454,10455,10459,10474,10463,10471,10466,10469,10470,10475,10461,10462,10464,10465,10472,10473,11212,11213,11216,11233,11238,11209,11214,11228,11204,11218,11219,11230,11234,11236,11239,11223,11224,11229,11235,11201,11205,11215,11217,11231,11203,11210,11225,11226,11207,11208,11211,11222,11220,11232,11206,11221,11237,10026,10027,10030,10037,10039,10001,10011,10018,10019,10020,10036,10029,10035,10010,10016,10017,10022,10012,10013,10014,10004,10005,10006,10007,10038,10280,10002,10003,10009,10021,10028,10044,10065,10075,10128,10023,10024,10025,10031,10032,10033,10034,10040,11361,11362,11363,11364,11354,11355,11356,11357,11358,11359,11360,11365,11366,11367,11412,11423,11432,11433,11434,11435,11436,11101,11102,11103,11104,11105,11106,11374,11375,11379,11385,11691,11692,11693,11694,11695,11697,11004,11005,11411,11413,11422,11426,11427,11428,11429,11414,11415,11416,11417,11418,11419,11420,11421,11368,11369,11370,11372,11373,11377,11378,10302,10303,10310,10306,10307,10308,10309,10312,10301,10304,10305,10314];

(async () => {
  const browser = await puppeteer.connect({
  browserWSEndpoint: 'wss://chrome.browserless.io/?token=fb656f23-16c1-4413-ab60-563b0cfb2893'
});
  //const browser = await puppeteer.launch();
  const page = await browser.newPage();
  await page.goto('https://www.tran.sla.ny.gov/JSP/query/PublicQueryAdvanceSearchPage.jsp');
  await page.type('#zipCode',"11218");
  // const results = await page.evaluate(() => {
  //   return [...document.querySelectorAll('input[value="all"]')].length
  //   // return [...document.querySelectorAll('input[type="radio"]'
  //   //   )].map(r => r.value)
  // })
  // console.log(results)

  await page.click('input[value="offPremise"]')
  await page.click('input[value="ac"]')
  await page.click('#searchButton');
  console.log("searching...")

  await page.waitForSelector('table');
  console.log('parsing tables...')

  const bodegas = []
  //parses table with businesses into an array of arrays
  const results = await page.evaluate(() => {
    return [...document.querySelectorAll('table')]
    .map(t => [...t.querySelectorAll('tr')]
      .map(r => [...r.querySelectorAll('.displayvalue')]
        .map(d => d.innerText.replace('\n',' '))))[18]
  })
    results.forEach(function(t){
      if (t[3] == 'AX'){
        bodegas.push(t)
        
      }
    })
    console.log(bodegas.length)
    //checks if there's a "next" button on this page, meaning more results to search 
    const next = await page.evaluate(() => {return document.querySelector('input[name="NextButton"]')})
    if (next) {
      console.log('clicking next...')
      await page.click('input[name="NextButton"]')
      await page.waitForSelector('table')
      results.forEach(function(t){
      if (t[3] == 'AX'){
        bodegas.push(t)
      }
      })
      console.log(bodegas.length)
    } else {
      console.log('less than 50 results')
    }
  //console.log(table)

  //we only want AX licensed businesses (imperfect proxy but a start)
 
  //console.log(bodegas)
  //await page.screenshot({path: 'example.png'});

  await browser.close();
})();