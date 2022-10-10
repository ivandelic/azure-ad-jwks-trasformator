const fdk = require('@fnproject/fdk');
const querystring = require('querystring');
const https = require('https');

fdk.handle(async function (input, ctx) {
  return httpsRequest({ url: ctx.config["AZURE_JWT_URI"], client_id: ctx.config["AZURE_JWT_CLIENT_ID"], client_secret: ctx.config["AZURE_JWT_CLIENT_SECRET"] }).then(data => {
    console.log("JWT:" + JSON.stringify(data));
    return data;
  }, error => {
    return error;
  });
})

const httpsRequest = (params) => new Promise((resolve, reject) => {
  const formData = querystring.stringify({
    grant_type: "client_credentials",
    client_id: params.client_id,
    client_secret: params.client_secret
  });
  const options = {
    method: 'POST',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
      'Content-Length': Buffer.byteLength(formData)
    }
  };
  const request = https.request(params.url, options, (response) => {
    let data = [];
    response.on('data', (chunk) => {
      data.push(chunk);
    });
    response.on('end', () => {
      resolve(Buffer.concat(data).toString());
    });
  });
  request.on('error', (error) => {
    reject(error);
  });
  request.write(formData);
  request.end();
});