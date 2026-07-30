const http = require('node:http');

http.createServer((request, response) => {
    const { method, url } = request;
    let body = [];



    request
        .on('error', err => {
            //E.g., the client disconnects abruptly, or the connection is corrupted. 
            //Without this, an error would crash your server or hang the request forever.
            console.error(err);
            response.writeHead(500);
            response.end('Internal Server Error');
        })
        .on('data', chunk => {
            // ✅ Node gives you data HERE — chunk by chunk
            // This is the ONLY place you receive body data
            body.push(chunk);
            //This can fire multiple times for a single request if the body is large. 
            //Each chunk is a Buffer (raw binary data), not a string yet. 
            //You collect/save each piece as it comes in — this is the only place you actually receive the data.
        })
        .on('end', () => {
            //This tells you "the client is done sending, no more data is coming." 
            //Notice this event itself carries no data — it's just a signal. 
            //That's why you have to combine everything you saved from the 'data' events 
            //using Buffer.concat(body), then convert the combined buffer into a readable string with .toString().



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



//Why request.on
//the request body arrives as a stream, not as a single chunk of data.
//When a client sends a POST request with a body (say, a 2MB JSON payload),
// Node doesn't hand it to you all at once, fully assembled. Instead, the data trickles in over
// the network in small pieces called chunks — think of it like water flowing through a pipe
// rather than a bucket being handed to you all at once.


//Since request is a stream (specifically a Readable stream),
// you have to listen for events to know what's happening with that flow of data.
// That's what .on(...) does — it's an event listener, same pattern as button.addEventListener('click', ...)
// in browser JS, just for streams instead of DOM events.


//Why Express feels so much simpler?
//Express's express.json() middleware is doing exactly the data/end/Buffer.concat/JSON.parse
//dance you see above — internally, behind the scenes — and just hands you the final,
//parsed result as req.body. That's the whole value proposition of a framework: it wraps repetitive
//low-level stream-handling boilerplate into a one-liner.