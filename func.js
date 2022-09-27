const fdk = require('@fnproject/fdk');
const https = require('https');

fdk.handle(async function (input) {
  return httpsRequest({url: 'https://login.microsoftonline.com/common/discovery/keys'}).then(data => {
    data.keys.forEach(element => {
      element["alg"] = "RS256"
    });
    console.log("Modified JWKS:" + JSON.stringify(data));
    return data;
  }, error => {
    return error;
  });
})

const httpsRequest = (options) => new Promise((resolve, reject) => {
  https.get(options.url, response => {
    let data = [];
    response.on('data', (chunk) => {
      data.push(chunk);
    });
    response.on('end', () => {
      console.log("Original JWKS:" + data);
      resolve(JSON.parse(Buffer.concat(data).toString()));
    });
  }).on('error', error => {
    reject(error);
  });
});
