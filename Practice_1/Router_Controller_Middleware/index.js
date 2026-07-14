const express = require("express");
const PORT = 8089;
const server = express();

server.get('/', (req, res) => {
    res.send("<h1>Express Js, Welcomes you!</h1>")
})

server.get('/about', (req, res) => {
    res.send("<h1>About Page</h1>");
})

server.get('/contacts', (req, res) => {
    res.send("<h1>Contacts Page</h1>")
})


//Query Params
server.get('/api/v1/users/allUsersByRole', (req, res) => {
    const query = req.query; //{role: admin}
    const searchedRole = query.role;

    const filteredUsers = allUserData.filter((user) => {
        if (user.role === searchedRole) {
            return true;
        }
        return false;
    });

    const payload = {
        sucess: true,
        data: filteredUsers,
        size: filteredUsers.length,
    }
    res.send(payload);
})


//URL Params
server.get('/api/v1/users/getUserByName/:name', (req, res) => {

    const params = req.params;
    const searchedName = params.name;

    const filteredUsers = allUserData.filter((user) => {
        if (user.name === searchedName) {
            return true;
        }
        return false;
    });

    const payload = {
        sucess: true,
        data: filteredUsers,
        size: filteredUsers.length,
    }

    //Why res.json?
    res.json(payload);
})


server.listen(PORT, () => {
    console.log(`Server running at PORT: ${PORT}`);
})