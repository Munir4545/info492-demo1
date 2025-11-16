const http = require('http');
const https = require('https');
const { URL } = require('url');

const OSRM_BASE_URL = process.env.OSRM_BASE_URL || 'https://router.project-osrm.org';
const DEFAULT_TIMEOUT_MS = Number(process.env.OSRM_TIMEOUT_MS || 7000);
const DEFAULT_MAX_RETRIES = Number(process.env.OSRM_MAX_RETRIES || 2);
const DEFAULT_BACKOFF_MS = Number(process.env.OSRM_BACKOFF_MS || 300);

function fetchJSON(pathname, attempt = 0) {
  const url = new URL(pathname, OSRM_BASE_URL);
  const client = url.protocol === 'http:' ? http : https;

  return new Promise((resolve, reject) => {
    const req = client.get(
      url,
      {
        timeout: DEFAULT_TIMEOUT_MS
      },
      res => {
        if (res.statusCode !== 200) {
          res.resume();
          reject(new Error(`OSRM request failed with status ${res.statusCode}`));
          return;
        }

        let data = '';
        res.setEncoding('utf8');
        res.on('data', chunk => {
          data += chunk;
        });
        res.on('end', () => {
          try {
            const parsed = JSON.parse(data);
            resolve(parsed);
          } catch (error) {
            reject(new Error(`Failed to parse OSRM response: ${error.message}`));
          }
        });
      }
    );

    const handleError = error => {
      console.warn(`[OSRM] request error (attempt ${attempt + 1}/${DEFAULT_MAX_RETRIES + 1}): ${error.message}`);
      if (attempt < DEFAULT_MAX_RETRIES) {
        setTimeout(() => {
          fetchJSON(pathname, attempt + 1).then(resolve).catch(reject);
        }, DEFAULT_BACKOFF_MS * (attempt + 1));
      } else {
        reject(error);
      }
    };

    req.on('error', handleError);

    req.on('timeout', () => {
      req.destroy(new Error('OSRM request timed out'));
    });
  });
}

async function snapToRoad(coords) {
  const { lat, lng } = coords;
  const response = await fetchJSON(`/nearest/v1/driving/${lng},${lat}?number=1`);

  if (response.code !== 'Ok' || !response.waypoints || response.waypoints.length === 0) {
    throw new Error(`OSRM nearest lookup failed: ${response.message || response.code}`);
  }

  const nearest = response.waypoints[0];
  return {
    lat: nearest.location[1],
    lng: nearest.location[0],
    name: nearest.name || null,
    distance: nearest.distance
  };
}

async function getRouteBetween(start, end) {
  const startCoord = `${start.lng},${start.lat}`;
  const endCoord = `${end.lng},${end.lat}`;
  const response = await fetchJSON(
    `/route/v1/driving/${startCoord};${endCoord}?overview=full&geometries=polyline6&steps=false&annotations=distance`
  );

  if (response.code !== 'Ok' || !response.routes || response.routes.length === 0) {
    throw new Error(`OSRM route lookup failed: ${response.message || response.code}`);
  }

  const route = response.routes[0];

  return {
    geometry: route.geometry,
    distance: route.distance, // meters
    duration: route.duration, // seconds
    legs: route.legs || []
  };
}

module.exports = {
  OSRM_BASE_URL,
  snapToRoad,
  getRouteBetween
};

