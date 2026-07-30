# MVC Backend Practice Project

A learning project built to understand backend fundamentals — Express.js, MongoDB/Mongoose, layered architecture (Router → Middleware → Controller → Service → Model), input validation with Zod, and full CRUD operations — using two resources: **Users** and **Blogs**.

---

## Table of Contents

1. [Aim of the Project](#aim-of-the-project)
2. [What This Project Does](#what-this-project-does)
3. [Insights Gained](#insights-gained)
4. [Technologies & Topics Covered](#technologies--topics-covered)
5. [Prerequisites](#prerequisites)
6. [How to Start the Project](#how-to-start-the-project)
7. [Data Flow](#data-flow)
8. [Folder Structure](#folder-structure)
9. [File-by-File Breakdown](#file-by-file-breakdown)
10. [Expected Inputs](#expected-inputs)
11. [Expected Outputs](#expected-outputs)
12. [Where to Send Requests & Check Responses](#where-to-send-requests--check-responses)
13. [Pending Topics / Not Yet Implemented](#pending-topics--not-yet-implemented)

---

## Aim of the Project

This project is **not** meant to be a production-ready application. It's a hands-on sandbox to genuinely understand:

- How a Node.js/Express backend is structured in layers (not just one giant file)
- How Express connects to and talks with MongoDB via Mongoose
- How CRUD (Create, Read, Update, Delete) operations work end-to-end, from an HTTP request to a database write and back
- How input validation should be separated from business logic
- Why real backends organize code the way they do (routers, middleware, controllers, services, models)

## What This Project Does

- Exposes a REST API with two resources: **Users** and **Blogs**
- Supports full CRUD on both resources
- Validates every incoming request body (using Zod) before it reaches the database
- Validates MongoDB ObjectIds in URL params before querying, to avoid ugly crash errors
- Connects to a **local MongoDB instance** (via MongoDB Compass / `mongod`) and stores/retrieves real data
- Returns clean, consistent JSON responses with proper HTTP status codes

## Insights Gained

Working through this project surfaced several real, practical lessons:

- **Collection names are case-sensitive in MongoDB.** `users` and `Users` are two entirely different collections — a subtle bug that caused "empty array" responses even though data existed.
- **`express.json()` is not automatic.** Without it, `req.body` is always empty, even if Postman sends a full JSON payload.
- **Route order matters in Express.** A catch-all route like `server.use('/', ...)` mounted *before* specific routes will intercept requests meant for those specific routes.
- **Validation belongs in middleware, not repeated in every controller function.** This avoids duplicated logic across Create/Update endpoints.
- **`safeParse()` vs `parse()` in Zod** — routine input validation (like a bad request body) is not an "exceptional" error and shouldn't use `try/catch`; `safeParse()` handles this cleanly via a `success` flag instead.
- **A malformed MongoDB ID crashes differently than a missing document** — these are two separate checks (`isValidObjectId` vs `if (!user)`), not one.

## Technologies & Topics Covered

| Category | Details |
|---|---|
| Runtime | Node.js |
| Framework | Express.js |
| Database | MongoDB (local instance via `mongod` / MongoDB Compass) |
| ODM | Mongoose |
| Validation | Zod (schema-based input validation) |
| Architecture | Layered: Router → Middleware → Controller → Service → Model |
| Concepts | CRUD operations, REST API design, middleware, environment variables (`dotenv`), MongoDB ObjectIds, schema design, HTTP status codes, request/response lifecycle |
| Testing tool | Postman (manual API testing) |

## Prerequisites

Before running this project, make sure you have:

1. **Node.js** installed (check with `node -v` in your terminal)
2. **MongoDB Compass** installed, and a local MongoDB server (`mongod`) running
   - Open Compass and confirm it can connect to `mongodb://localhost:27017`
   - Make sure the `Practice` database exists, with `users` and `blogs` collections (lowercase)
3. **Postman** (or any REST client) installed, to send test requests
4. Project dependencies installed via `npm install` (see below)
5. A `.env` file in the project root containing:
   ```
   SECRET_SERVER_PASSWORD=your_password_here
   ```
   (only required if you re-enable `passwordAuthMiddleware` on any route)

## How to Start the Project

1. Open a terminal and navigate to the project root (where `index.js` lives).
2. Install dependencies:
   ```bash
   npm install
   ```
3. Make sure MongoDB is running locally (open MongoDB Compass and confirm it connects to `localhost:27017`).
4. Start the server:
   ```bash
   node index.js
   ```
   or, for auto-restart on file changes during development:
   ```bash
   npx nodemon index.js
   ```
5. Confirm in the terminal you see:
   ```
   Connected to MongoDB
   Connected to database: Practice
   Server running at PORT: 8089
   ```
6. Open Postman and start sending requests to `http://localhost:8089/api/v1/users` or `http://localhost:8089/api/v1/blogs`.

## Data Flow

For anyone new to this project, here's the order to read the code in to understand how a single request flows through the system:

```
1. index.js
   → sets up Express, connects to MongoDB, mounts routers

2. Router/MongoDB_Routers/UserActivityRouter.js  (or BlogActivityRouter.js)
   → defines each endpoint (POST, GET, PUT, DELETE) and which
     middleware + controller function handles it

3. Middleware/validateBody.js and Middleware/validateId.js
   → run BEFORE the controller; check the request body / URL param
     are valid; if not, respond immediately with a 400 error

4. Controller/MongoDB_Controller/UserActivityController.js (or BlogActivityController.js)
   → receives the already-validated request, calls the matching
     Service function, and shapes the HTTP response (status + JSON)

5. Services/UserService.js (or BlogService.js)
   → contains the actual business logic; talks directly to the
     Mongoose Model

6. Models/Users.Model.js (or Blogs.Model.js)
   → defines the schema (fields, types, required rules) and which
     MongoDB collection to use

7. MongoDB (via Mongoose connection)
   → the data is actually read from / written to disk here
```

**Practical example — creating a user:**
```
Postman sends POST /api/v1/users with a JSON body
   → UserActivityRouter routes it to validateBody(validateUserInput)
   → validateBody checks the body against the Zod schema
       → if invalid: respond with 400 + error messages, STOP here
       → if valid: attach clean data to req.validatedBody, call next()
   → createUser controller runs, calls UserService.createUser(req.validatedBody)
   → UserService calls User.create(data) (Mongoose)
   → Mongoose validates again at the schema level, then writes to MongoDB
   → MongoDB confirms the write, returns the saved document (with new _id)
   → Controller sends back res.status(201).json(user)
   → Postman displays the response
```

## Folder Structure

```
MONGODB_BASICS/
├── Controller/
│   └── MongoDB_Controller/
│       ├── UserActivityController.js
│       └── BlogActivityController.js
├── Middleware/
│   ├── PasswordAuthMiddleware.js
│   ├── validateBody.js
│   └── validateId.js
├── Models/
│   ├── Users.Model.js
│   └── Blogs.Model.js
├── Router/
│   ├── HomeRouter.js
│   └── MongoDB_Routers/
│       ├── UserActivityRouter.js
│       └── BlogActivityRouter.js
├── Services/
│   ├── UserService.js
│   └── BlogService.js
├── Validator/
│   ├── UserInputValidation.js
│   └── BlogInputValidation.js
├── utils/
│   └── validateObjectId.js
├── .env
├── .gitignore
├── index.js
├── package.json
└── README.md
```

## File-by-File Breakdown

| File | Purpose |
|---|---|
| `index.js` | Entry point — creates the Express app, applies global middleware (`express.json()`), mounts routers, connects to MongoDB, starts the server on a port |
| `Router/MongoDB_Routers/UserActivityRouter.js` | Defines all `/api/v1/users` endpoints and wires up which middleware + controller function each one uses |
| `Router/MongoDB_Routers/BlogActivityRouter.js` | Same as above, but for `/api/v1/blogs` |
| `Router/HomeRouter.js` | Handles the base `/` route (separate from the MongoDB resource routes) |
| `Middleware/validateBody.js` | Reusable middleware factory — takes a Zod validator function, checks `req.body` against it, stops the request with a 400 if invalid |
| `Middleware/validateId.js` | Checks that `req.params.id` is a well-formed MongoDB ObjectId before letting the request reach the controller |
| `Middleware/PasswordAuthMiddleware.js` | Checks a shared secret password sent in request headers (currently only used on `HomeRouter`, disabled elsewhere) |
| `Controller/MongoDB_Controller/UserActivityController.js` | Handles the HTTP layer for Users — calls the Service, sets status codes, returns JSON |
| `Controller/MongoDB_Controller/BlogActivityController.js` | Same as above, for Blogs |
| `Services/UserService.js` | Business logic layer for Users — talks directly to the Mongoose `User` model |
| `Services/BlogService.js` | Same as above, for Blogs |
| `Models/Users.Model.js` | Mongoose schema for a User document (name, email, age, gender, contact, nationality, password) and which collection (`users`) it maps to |
| `Models/Blogs.Model.js` | Mongoose schema for a Blog document (title, content, author, category, tags, likes, views, published) and which collection (`blogs`) it maps to |
| `Validator/UserInputValidation.js` | Zod schemas for validating User input — one strict version for create, one partial version for update |
| `Validator/BlogInputValidation.js` | Same as above, for Blogs |
| `utils/validateObjectId.js` | Small helper — checks if a string could be a valid MongoDB ObjectId |
| `.env` | Stores environment variables (e.g. `SECRET_SERVER_PASSWORD`) — never commit this file |

## Expected Inputs

### Create a User — `POST /api/v1/users`
```json
{
  "name": "Priya Nair",
  "email": "priya.nair@example.com",
  "age": 26,
  "gender": "Female",
  "contact": "9123456780",
  "nationality": "Indian",
  "password": "Priya@2026"
}
```

### Update a User — `PUT /api/v1/users/:id`
```json
{
  "age": 27
}
```
(only the fields being changed are required — all fields are optional on update)

### Create a Blog — `POST /api/v1/blogs`
```json
{
  "title": "Why I Switched to a Standing Desk",
  "content": "After months of back pain, I finally tried a standing desk. Here's what changed.",
  "author": "Priya Nair",
  "category": "Lifestyle",
  "tags": ["health", "productivity"],
  "likes": 0,
  "views": 0,
  "published": true
}
```

### Update a Blog — `PUT /api/v1/blogs/:id`
```json
{
  "likes": 15
}
```

## Expected Outputs

### Successful creation (`201 Created`)
```json
{
  "_id": "6a5f4e48ebc14e7257a8c161",
  "name": "Priya Nair",
  "email": "priya.nair@example.com",
  "age": 26,
  "gender": "Female",
  "contact": "9123456780",
  "nationality": "Indian",
  "password": "Priya@2026",
  "createdAt": "2026-07-30T10:15:00.000Z",
  "updatedAt": "2026-07-30T10:15:00.000Z",
  "__v": 0
}
```

### Validation failure (`400 Bad Request`)
```json
{
  "error": [
    "Please enter a valid email address.",
    "Contact must be a 10-digit number."
  ]
}
```

### Invalid ID format (`400 Bad Request`)
```json
{ "error": "Invalid ID format." }
```

### Document not found (`404 Not Found`)
```json
{ "error": "User not found" }
```

### Successful deletion (`200 OK`)
```json
{ "message": "User deleted successfully" }
```

## Where to Send Requests & Check Responses

- **Send requests from:** Postman (Method + URL + Body tab set to raw/JSON)
- **Base URL:** `http://localhost:8089`
- **Endpoints:**
  | Method | Endpoint | Purpose |
  |---|---|---|
  | POST | `/api/v1/users` | Create a user |
  | GET | `/api/v1/users` | Get all users |
  | GET | `/api/v1/users/:id` | Get one user |
  | PUT | `/api/v1/users/:id` | Update a user |
  | DELETE | `/api/v1/users/:id` | Delete a user |
  | POST | `/api/v1/blogs` | Create a blog |
  | GET | `/api/v1/blogs` | Get all blogs |
  | GET | `/api/v1/blogs/:id` | Get one blog |
  | PUT | `/api/v1/blogs/:id` | Update a blog |
  | DELETE | `/api/v1/blogs/:id` | Delete a blog |
- **Check the response:** In Postman's response panel (below the request), under the "Body" tab
- **Check the raw data:** Open MongoDB Compass → `Practice` database → `users` or `blogs` collection, or run `db.users.find().pretty()` in `mongosh`
- **Check server-side logs/errors:** The terminal window where `node index.js` (or `nodemon`) is running

## Pending Topics / Not Yet Implemented

These are natural next steps to extend this project further:

- **Authentication & Authorization** — replace the single shared password with real JWT-based login (per-user tokens, password hashing with bcrypt)
- **Centralized error handling** — a single Express error-handling middleware (4-argument `(err, req, res, next)`) instead of repeating `try/catch` + `res.status(...)` in every controller function
- **`asyncHandler` wrapper** — removes repeated `try/catch` boilerplate around every async controller function
- **Pagination, filtering, sorting** — e.g. `GET /api/v1/blogs?page=2&limit=10&sort=-createdAt`
- **Relationships between resources** — linking `Blog.author` to an actual `User` document via `mongoose.Schema.Types.ObjectId` + `.populate()`
- **Security middleware** — `cors` (control which frontends can call the API), `helmet` (safer HTTP headers), rate limiting
- **Logging** — request logging with `morgan`, structured application logs with `winston`/`pino`
- **Automated testing** — unit tests for services/validators (Jest/Vitest), integration tests for routes (Supertest)
- **API documentation** — Swagger/OpenAPI spec, or a maintained endpoint reference
- **Config validation at startup** — fail fast if required environment variables (`DB_URL`, `SECRET_SERVER_PASSWORD`) are missing