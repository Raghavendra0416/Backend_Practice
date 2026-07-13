//initalizing using npm init
//NPM is a package manager for node.js 

//We need to run node filename for every change, so we have used nodemon, will will chack for the 
//changes and it will run the server itself.

const express = require("express"); //using http module behind the scenes
const PORT = 8089;
const server = express();

server.get('/', (req, res) => {
    //send keyword is not in node.js
    //behind the scenes uses res.write, res.end.
    res.send("<h1>Express Js, Welcomes you!</h1>")

    //you cannot do anything here as res.send will do the res.write and res.end. 
    //After end you won't be able to do any operations.
})

server.get('/about', (req, res) => {
    res.send("<h1>About Page</h1>");
})

server.get('/contacts', (req, res) => {
    res.send("<h1>Contacts Page</h1>")
})


server.listen(PORT, () => {
    console.log(`Server running at PORT: ${PORT}`);
})