const http = require('http');
const port = 2288;


const server = http.createServer((req, res) => {
  res.statusCode = 200;
  res.setHeader('Content-Type', 'text/plain');
  res.end(`Framework`);
});


server.listen(port, () => {
  console.log(`Framework on http://localhost:${port}/`);
});