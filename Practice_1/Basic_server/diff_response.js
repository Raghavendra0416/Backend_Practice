const httpModule = require('http');
const PORT = 8089;
const log = console.log;

//How to check the different requests and handle the different responses.
const server = httpModule.createServer((req, res) => {
    const url = req.url;

    if (url === "/") {
        res.write("<h1>Welcome to Home Page</h1>")
        res.write("Description about home page")
        res.end();
    } else if (url === "/about") {
        res.write("<h1>About Page</h1>");
        res.end();
    } else if (url === "/contacts") {
        res.write("<h1>Contacts</h1>");
        res.end();
    } else {
        res.write("<h1>Page Does not exist</h1>");
        res.end();
    }
});


server.listen(PORT, () => {
    log(`server is running at PORT: ${PORT}`);
})