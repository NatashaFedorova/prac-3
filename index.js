const http = require('http');
const formidable = require('formidable');
const path = require('path');
const fs = require('fs').promises;

http
  .createServer(async (req, res) => {
    if (req.url === '/api' && req.method.toLowerCase() === 'post') {
      // parse a file upload
      const form = formidable({ multiples: true });

      form.parse(req, (err, fields, files) => {
        if (err) {
          res.writeHead(err.httpCode || 400, { 'Content-Type': 'text/plain' });
          res.end(String(err));
          return;
        }
        res.writeHead(200, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ fields, files }, null, 2));
      });
    }
    if (req.url === '/home') {
      const filePath = path.join(__dirname, '/text.txt');
      const data = await fs.readFile(filePath);
      res.end(data);
    }
    if (req.url === '/contact' && req.method.toLowerCase() === 'post') {
      const form = formidable({ multiples: true });

      form.parse(req, async (err, fields, files) => {
        if (err) {
          res.writeHead(err.httpCode || 400, { 'Content-Type': 'text/plain' });
          res.end(String(err));
          return;
        }

        const filePath = path.join(__dirname, files.file.originalFilename); // сформували шлях, dirname - де ми зараз
        console.log(filePath);
        const data = await fs.readFile(filePath, 'utf8');
        const updateData = `${data}, ${JSON.stringify(fields)}`;

        await fs.writeFile(filePath, updateData, 'utf8'); // fs.writeFile(куда, что, формат)

        res.writeHead(200, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ fields }, null, 2));
      });
    }
    if (req.url === '/tasks') {
      res.end('Tasks!');
    }
  })
  .listen(3001, () => {
    console.log('Server is runnig');
  });
