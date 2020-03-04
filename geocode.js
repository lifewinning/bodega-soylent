const fs = require('fs');
const csv = require('csv-parser');
const request = require('request');

// const ChromeOptions = {
//   headless: false,
//   defaultViewport: null
// };

const geojson = {
  "type": "FeatureCollection",
  "features": []
};
(async () => {
  var stream = fs.createReadStream('soylent-dedupe-firstpass.csv')
  return new Promise((resolve,reject) => {
  parser = stream.pipe(csv()).on('data', async (row) => {
      parser.pause(); 
      const data = `${row['address']} ${row['borough']} NY, ${row['zip']}`
      console.log(`searching ${row['name']}`)
      const ltln = request(`http://www.mapquestapi.com/geocoding/v1/address?key=s0VVKAjqexVJ7O1c7bPGGieyfriJIMgv&location=${data}`, { json: true }, (err, res, body) => {
            if (err) { return console.log(err); 
            }

              obj = {
              "type": "Feature",
              "properties": {
                "address": data,
                "name": `${row['name']}`
              },
              "geometry": {
                "type": "Point",
                "coordinates": [
                  body.results[0].locations[0].latLng.lng, body.results[0].locations[0].latLng.lat
                ]
              }
            }
            geojson.features.push(obj)
            console.log(`added ${data}`);
            //console.log(body.results[0].locations[0].latLng); 
     
      parser.resume();
      fs.writeFileSync('soylent-secondpass.geojson', JSON.stringify(geojson))
      }).on('end', () => {
        console.log(`${geojson.features.length} geocoded`)
    }
      ).on('error', () => reject(console.log("error")));
  })
})})();
