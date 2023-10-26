const express = require('express');
const geoip = require('geoip-lite');
const fs = require('fs');
const { parseUserAgent } = require('./helpers');
var ip = require("ip");
console.log(ip.address())
const app = express();
require('dns').lookup(require('os').hostname(), function (err, add, fam) {
  console.log('addr: ' + add);
})

/**
 * Middleware to get geo information based on IP address
 * @param {express.Request} req
 * @param {express.Response} res
 * @param {express.NextFunction} next
*/
const getGeoInformation = (req, res, next) => {
  const userAgent = req.headers['user-agent']
  const device = parseUserAgent(userAgent)
  console.log("🚀 ~ file: app.js:17 ~ getGeoInformation ~ device:", device)
  const geo = geoip.lookup(ip.address());
  console.log("🚀 ~ file: index.js:16 ~ getGeoInformation ~ geo:", ip.address())
  
  if (geo) {
    req.geoData = {
      lat: geo.ll[0],
      lon: geo.ll[1]
    };
  } else {
    req.geoData = null;
  }
  
  // Here, you can save the geoData into a database for further analysis
  
  next();
};
app.use(express.json()); // para parsear payloads de tipo JSON

app.set('view engine', 'pug');
app.use(getGeoInformation);
app.get('/', (req, res) => {
  res.render('index');
});

app.get('/tracking_pixel', (req, res) => {
  // Your tracking logic here
  
  const img = fs.readFileSync('./1x1_pixel.png');
  res.writeHead(200, {'Content-Type': 'image/png' });
  res.end(img, 'binary');
});

const PORT = 3000;
app.post('/save_location', (req, res) => {
  const { lat, lon } = req.body;

  // Aquí guardas los datos en tu base de datos
  console.log(`Latitude: ${lat}, Longitude: ${lon}`);
  
  res.status(200).json({ message: 'Location saved' });
});


app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
