// loading express in server.js
const express = require('express');
const app = express();
app.use(express.json()); // to read JSON data sent in request bodies.


const port = 8081;
const todoList = ["Hello", "World", "Welcome"]

//GET
app.get('/todos', (req, res) => {
    res.send(todoList);
});

//POST
app.post('/todos', (req, res) => {
    const newTodo = req.body.name;
    if (newTodo) {
        todoList.push(newTodo);
        res.status(201).end(); // 201 Status Code, Empty Response
    } else {
        res.status(400).end(); // Bad Request if name is missing
    }
});

//DELETE
app.delete('/todos', (req, res) => {
    const todoToDelete = req.body.name;
    const index = todoList.indexOf(todoToDelete);

    if (index !== -1) {
        todoList.splice(index, 1);
        res.status(204).end(); // 204 Status Code, Empty Response
    } else {
        res.status(404).end(); // Optional: Not Found if item isn't there
    }
});

// Reject other HTTP methods on /todos
app.all('/todos', (req, res) => {
    res.status(501).end();
});

// Wildcard fallback for any other unknown path
app.use((req, res) => {
    res.status(404).end();
});

app.listen(port, () => {
    console.log(`Server is up at ${port}`);
});


//Commands
//GET: curl -X GET http://loaclhost:8081/todos

//POST: curl -X POST -d '{"name":"Plan for next week"}' http://localhost:8081/todos -H 'content-type:application/json'

//DELETE: curl -v -X DELETE -d '{"name":"Hello"}' http://localhost:8081/todos -H 'content-type:application/json'