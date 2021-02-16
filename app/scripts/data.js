const fs = require("fs");
const https = require("https");
const { URL } = require("url");

// Downloads flight data from Open Flights

const config = {
  "https://raw.githubusercontent.com/jpatokal/openflights/master/data/airports.dat": `${__dirname}/../../data/airports.dat`,
  "https://raw.githubusercontent.com/jpatokal/openflights/master/data/routes.dat": `${__dirname}/../../data/routes.dat`,
};

const download = (url, filename) => {
  fs.stat(filename, (err) => {
    if (!err) return;

    const opts = new URL(url);
    opts.method = "GET";

    https
      .request(opts, (res) => {
        res.pipe(fs.createWriteStream(filename));
      })
      .end();
  });
};

Object.keys(config).forEach((url) => {
  const filename = config[url];
  download(url, filename);
});
