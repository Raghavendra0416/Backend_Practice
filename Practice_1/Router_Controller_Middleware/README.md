### We Are Understanding MVC Architecture.

### In this we are talking about Routers,Controllers,Middleware.


### Flow:
1. User Asks for GET/PUT/POST or some other request --> 
2. The Request will be taken by index.js and the index.js will use middleware to validate the request -->
3. After validation it will passed to the Controller to perform the activity. The Controller   consists of Different functions to handle Different requests. after handling the request the controller sends back the response.


### What does Index.js Consists?
It consists of different imported middleware, controllers. 
- Index.js uses the middleware to validate the password/Auth.
- Index.js uses Controllers to handle the request and response.


### Note:
- We are using nodemon to restart the server automatically.
- We are using .env File to save the secret keys.
- The .env files and nodemodules are being ignored by .gitIgnore.
