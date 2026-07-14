### We Are Understanding MVC Architecture.

### In this we are talking about Routers,Controllers,Middleware.

### Flow:
1. User Asks for GET/PUT/POST or some other request --> 
2. The Request will be taken by index.js(the server is starting here) and the index.js will pass it router
3. The router will checks, which route it belongs to and will do middleware. middleware is used to validate the request -->
3. After validation request will passed(using next()) to the Controller to perform the activity. The Controller consists of different functions to handle different requests. after handling the request the controller sends back the response.

### What does Index.js Consists?
It consists of different imported routers,middleware, controllers. 
- Index.js uses Routes to redirect the routes.
- Index.js uses the middleware to validate the password/Auth.
- Index.js uses Controllers to handle the request and response.

### What does Routes Consists?
It consists the different routes. and it will redirected according to the routes.

### What does Middleware consists?
It consists the logic to validate the request is correct or not.
Like if the request is having password/secrect key.
- If the validated request does not contain the secreat key or required data, middleware will throw error.

### What does Controller consists?
It consists the handling of request and responses. like:
- what data needs be sent
- what needs to be send if failed...

### Note:
- We are using nodemon to restart the server automatically.
- We are using .env File to save the secret keys.
- The .env files and nodemodules are being ignored by .gitIgnore.
