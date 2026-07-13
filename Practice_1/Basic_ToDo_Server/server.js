// Without Express.js
//Native Node.js
const http = require('http');
const port = 8081;

let todoList = ["Complete Node Byte", "Play Cricket"];

http.createServer((request, response) => {
    //GET
    // STEP 2: Handle the GET /todos route
    if (request.url === "/todos" && request.method === "GET") {
        response.writeHead(200, { "Content-Type": "application/json" });
        response.end(JSON.stringify(todoList));
    }

    //POST
    // STEP 3: Handle the POST /todos route
    else if (request.url === "/todos" && request.method === "POST") {
        let body = "";

        // Listen for data chunks coming in
        request.on("data", (chunk) => {
            body += chunk.toString();
        });

        // Once all data is received
        request.on("end", () => {
            // Parse the string into a JSON object
            const newItem = JSON.parse(body);

            // Add the name to our todoList array
            todoList.push(newItem.name);

            // Send 201 Created status
            response.writeHead(201);
            response.end();
        });
    }

    //DELETE
    // STEP 4: Handle the DELETE /todos route
    else if (request.url === "/todos" && request.method === "DELETE") {
        let body = "";

        request.on("data", (chunk) => {
            body += chunk.toString();
        });

        request.on("end", () => {
            const itemToDelete = JSON.parse(body);
            const index = todoList.indexOf(itemToDelete.name);

            // If the item exists in our array, remove it
            if (index !== -1) {
                todoList.splice(index, 1);
                response.writeHead(204); // 204 means "No Content" (Success)
            } else {
                response.writeHead(404); // Item not found
            }
            response.end();
        });
    }

    // Handle the default Home route
    else if (request.url === "/") {
        response.writeHead(200, { "Content-Type": "text/html" });
        response.write('<h1>TODO List Home Page</h1>');
        response.end();
    }
    // Handle undefined routes
    else {
        response.writeHead(404);
        response.end();
    }

    // Set response status code and response headers
    // response.writeHead(200, { 'Content-Type': 'text/html' });
    // Set response body i.e, data to be sent
    // response.write('<h1>TODO</h1>');
    // Tell the server the response is complete and to close the connection
    // response.end();
}).listen(port, () => {
    // Log text to the terminal once the server starts
    console.log(`Nodejs server started on port ${port}`)
});


//Commands
//GET: curl -X GET http://loaclhost:8081/todos

//POST: curl -X POST -d '{"name":"Plan for next week"}' http://localhost:8081/todos -H 'content-type:application/json'

//DELETE: curl -v -X DELETE -d '{"name":"Hello"}' http://localhost:8081/todos -H 'content-type:application/json'