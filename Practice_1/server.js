const http = require('node:http');

http.createServer((request, response) => {
    const { method, url } = request;
    let body = [];

    request
        .on('error', err => {
            console.error(err);
            response.writeHead(500);
            response.end('Internal Server Error');
        })
        .on('data', chunk => {
            // ✅ Node gives you data HERE — chunk by chunk
            // This is the ONLY place you receive body data
            body.push(chunk);
        })
        .on('end', () => {
            // ❌ Node gives you NO data here
            // It just signals "I'm done sending"
            // body here is whatever YOU saved earlier
            body = Buffer.concat(body).toString();

            // Parse JSON if a body was sent
            let parsed = {};
            if (body) {
                try { parsed = JSON.parse(body); } catch (e) { }
            }

            // Simple routing
            if (method === 'GET' && url === '/hello') {
                response.writeHead(200, { 'Content-Type': 'application/json' });
                response.end(JSON.stringify({ message: 'Hello, world!' }));

            } else if (method === 'POST' && url === '/echo') {
                response.writeHead(200, { 'Content-Type': 'application/json' });
                response.end(JSON.stringify({ youSent: parsed }));
            } else {
                response.writeHead(404);
                response.end('Not found');
            }
        });

}).listen(8080, () => {
    console.log('Server running at http://localhost:8080');
});