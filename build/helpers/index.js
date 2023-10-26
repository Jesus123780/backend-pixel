"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.parseUserAgent = parseUserAgent;
var _os = _interopRequireDefault(require("os"));
function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
function getDeviceInfo() {
  const deviceInfo = {
    cpuModel: _os.default.cpus()[0].model,
    platform: _os.default.platform(),
    cpuArchitecture: _os.default.arch(),
    totalMemory: _os.default.totalmem() / (1024 * 1024 * 1024),
    // Convertir a GB
    freeMemory: _os.default.freemem() / (1024 * 1024 * 1024),
    // Convertir a GB
    hostname: _os.default.hostname(),
    release: _os.default.release(),
    uptime: _os.default.uptime(),
    userInfo: _os.default.userInfo(),
    networkInterfaces: _os.default.networkInterfaces()
  };
  return deviceInfo;
}
function parseUserAgent(userAgent) {
  if (!userAgent) return;
  const browserInfo = {
    name: 'Unknown',
    short_name: getDeviceInfo().cpuModel,
    version: getDeviceInfo().release || 'Unknown',
    family: 'Unknown',
    platform: getDeviceInfo().platform || 'Unknown',
    device: detectDeviceType(userAgent),
    os: detectOperatingSystem(userAgent),
    model: detectDeviceModel(userAgent)
  };
  const browser = detectBrowser(userAgent);
  browserInfo.name = browser.name;
  browserInfo.version = browser.version;
  browserInfo.family = browser.family;
  return browserInfo;
}
function detectDeviceType(userAgent) {
  if (/Mobile|Android|iPhone|iPad|iPod|Windows Phone/i.test(userAgent)) return 'Mobile';
  if (/Tablet/i.test(userAgent)) return 'Tablet';
  return 'Desktop';
}
function detectDeviceModel(userAgent) {
  const modelPatterns = {
    iPhone: /iPhone/i,
    iPad: /iPad/i,
    SamsungGalaxy: /Samsung Galaxy/i
  };
  for (const [model, pattern] of Object.entries(modelPatterns)) {
    if (pattern.test(userAgent)) return model;
  }
  return 'Unknown';
}
function detectBrowser(userAgent) {
  const browserPatterns = {
    Chrome: /Chrome\/([0-9.]+)/,
    Firefox: /Firefox\/([0-9.]+)/,
    Safari: /Version\/([0-9.]+).*Safari/,
    Edge: /Edg\/([0-9.]+)/,
    IE: /MSIE ([0-9.]+)/
  };
  for (const [name, pattern] of Object.entries(browserPatterns)) {
    const match = userAgent.match(pattern);
    if (match) return {
      name,
      version: match[1],
      family: name
    };
  }
  return {
    name: 'Unknown',
    version: 'Unknown',
    family: 'Unknown'
  };
}
function detectOperatingSystem(userAgent) {
  const osPatterns = {
    Windows: /Windows/i,
    MacOS: /Macintosh|Mac OS X/i,
    Linux: /Linux/i,
    Android: /Android/i,
    iOS: /iPhone|iPad|iPod/i
  };
  for (const [os, pattern] of Object.entries(osPatterns)) {
    if (pattern.test(userAgent)) return os;
  }
  return 'Unknown';
}