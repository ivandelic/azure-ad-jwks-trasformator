const fdk = require('@fnproject/fdk');
const https = require('https');

fdk.handle(async function (input, ctx) {
  return httpsRequest({url: ctx.config["AZURE_JWKS_URI"]}).then(data => {
    data.keys.forEach(element => {
      if (!!ctx.config["AZURE_JWKS_APPEND_ALG"])
        element["alg"] = ctx.config["AZURE_JWKS_APPEND_ALG"]
      if (!!ctx.config["AZURE_JWKS_SKIP_X5C"])
        delete element["x5c"]
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
