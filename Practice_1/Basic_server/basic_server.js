import httpModule from 'http'; // -> imported severModule
const PORT = 8089 //-> Provided a port number so anything connecting to server can listen
// We can have any port 100, 200, 8286.
// There are ports we cannot use like: 8081(used by OS), 8080 ...these are reserved Http, Https ports.


//The below shows how to create a vaery basic server.
const server = httpModule.createServer((req, res) => {
    console.log("REQUEST RECIVED!");
    res.end("Request Ended!, The Response is: Hello World!");
});


server.listen(PORT, () => {
    console.log(`Server is running on PORT: ${PORT}`);
})
