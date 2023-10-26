"use strict";

const express = require('express');
const geoip = require('geoip-lite');
const fs = require('fs');
const {
  parseUserAgent
} = require('./helpers');
const app = express();

/**
 * Middleware to get geo information based on IP address
 * @param {express.Request} req
 * @param {express.Response} res
 * @param {express.NextFunction} next
 */
const getGeoInformation = (req, res, next) => {
  const ip = req.headers['x-forwarded-for'] || req.connection.remoteAddress;
  const userAgent = req.headers['user-agent'];
  const device = parseUserAgent(userAgent);
  console.log("🚀 ~ file: app.js:17 ~ getGeoInformation ~ device:", device);
  const geo = geoip.lookup(ip);
  console.log("🚀 ~ file: index.js:16 ~ getGeoInformation ~ geo:", geo);
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
app.use(getGeoInformation);
app.get('/tracking_pixel', (req, res) => {
  // Your tracking logic here

  const img = fs.readFileSync('./1x1_pixel.png');
  res.writeHead(200, {
    'Content-Type': 'image/png'
  });
  res.end(img, 'binary');
});
const PORT = 3000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});