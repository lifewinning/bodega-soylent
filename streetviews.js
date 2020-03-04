//default form for making a street view embed

// https://www.google.com/maps/embed/v1/streetview
//   ?key=YOUR_API_KEY
//   &location=46.414382,10.013988
const fs = require('fs');
const cheerio = require('cheerio')
const fsc = require('fs-cheerio')

// async function HTMLwrite(string,html){
//   fs.appendFile(html,string,function(err){
//     if (err) throw err;
//     //console.log('new row');
//   })
//  };

const stream = fs.readFileSync('geojsons/soylent-secondpass.geojson')
parser = JSON.parse(stream);

(async function(){
	let $ = await fsc.readFile('template.html')

	parser.features.forEach(function(p,i){
		const location = `location${i}`
		$('div').append(
			`<span id="${location}" data-name="${p.properties.name}" data-address="${p.properties.address}" data-location="${p.geometry.coordinates}" data-bodega="">
			<a href="#${location}" onclick=changeIFrame(${p.geometry.coordinates[1]},${p.geometry.coordinates[0]})>${p.properties.name}</a>
			<br>${p.properties.address}<br>
			<input onclick=logBodegaStatus('${location.toString()}') type="radio" name="status${location.toString()}" value='isbodega' />Is A Bodega<br>
			<input onclick=logBodegaStatus('${location.toString()}') type="radio" name="status${location.toString()}" value='notbodega' />Not A Bodega<br>
			<input onclick=logBodegaStatus('${location.toString()}') type="radio" name="status${location.toString()}" value="maybebodega" />Not Sure<br><br>
			</span>`)
	})
	await fsc.writeFile('index.html', $)
	
})();


