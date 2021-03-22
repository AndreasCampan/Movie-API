const http = require('http');
const url = require('url');
const fs = require('fs');

http.createServer((req, res) => {
  let addr = req.url;
  let parAddr = url.parse(addr, true);
  let filePath = '';

  fs.appendFile('log.txt', `URL: ${addr}\nDate: ${new Date()}\n\n`, (err) => {
    if (err) {
      fs.appendFile('log.text', (err));
    }
  });

  if (parAddr.pathname.includes('documentation')) {
    filePath = (`${__dirname}/documentation.html`);
  } else {
    filePath = 'index.html';
  }

  fs.readFile(filePath, (err, data) => {
    if (err) {
      throw err;
    } else {
      res.writeHead(200, { 'Content-Type': 'text/html' });
      res.write(data);
      res.end(`The response is OK\n ${filePath}`);
    }
  });
}).listen(8080);

console.log('My test server is running on Port 8080.');
