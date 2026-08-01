# MongoDB Backend Practice Project (MVC Part 2)

A learning project built to understand backend fundamentals — Express.js, MongoDB/Mongoose, layered architecture (Router → Middleware → Controller → Service → Model), input validation with Zod, centralized error handling, and JWT-based authentication — using two resources: **Users** and **Blogs**.

---

## Table of Contents

1. [Aim of the Project](#aim-of-the-project)
2. [What This Project Does](#what-this-project-does)
3. [Insights & Issues Encountered](#insights--issues-encountered)
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
- How centralized error handling removes repeated `try/catch` boilerplate
- How JWT-based authentication and password hashing actually work under the hood
- Why real backends organize code the way they do (routers, middleware, controllers, services, models)

## What This Project Does

- Exposes a REST API with two resources: **Users** and **Blogs**, plus an **Auth** resource for register/login
- Supports full CRUD on Users and Blogs
- Validates every incoming request body (using Zod) before it reaches the database
- Validates MongoDB ObjectIds in URL params before querying, to avoid ugly crash errors
- Hashes passwords with bcrypt before storing them — plain-text passwords are never saved
- Issues per-user JWT tokens on register/login, and protects update/delete routes so only authenticated requests can modify data
- Catches every error — from Mongoose, from JWT verification, or thrown deliberately in application code — through a single centralized error handler, returning consistent JSON with the correct HTTP status code
- Connects to a **local MongoDB instance** (via MongoDB Compass / `mongod`) and stores/retrieves real data

## Insights & Issues Encountered

Working through this project surfaced several real, practical lessons — including bugs that were actually hit and fixed during development, not just theoretical warnings.

### Structural / setup issues
- **Collection names are case-sensitive in MongoDB.** `users` and `Users` are two entirely different collections — this caused "empty array" responses even though data existed in the differently-cased collection.
- **`express.json()` is not automatic.** Without it, `req.body` is always empty, even if Postman sends a full JSON payload — this caused every `POST` to fail Zod validation with "field is required" errors, even when the request body looked correct in Postman.
- **Route order matters in Express.** A catch-all route like `server.use('/', ...)` mounted *before* specific routes intercepted requests meant for those specific routes, causing unrelated 401 errors.
- **`dotenv.config()` must run before anything reads `process.env`, as the very first line of the entry file.** After removing the old password-auth middleware (which happened to call `dotenv.config()`), nothing else loaded the `.env` file — causing `JWT_SECRET` to be `undefined` and `jsonwebtoken` to throw `"secretOrPrivateKey must have a value"`.

### Validation & error-handling issues
- **Validation belongs in middleware, not repeated in every controller function** — avoids duplicated logic across Create/Update endpoints for both resources.
- **`safeParse()` vs `parse()` in Zod** — routine input validation (a bad request body) isn't an "exceptional" error and shouldn't use `try/catch`; `safeParse()` handles it cleanly via a `success` flag instead.
- **A malformed MongoDB ID crashes differently than a missing document** — these are two separate checks (`isValidObjectId` before querying, vs. `if (!doc)` after querying), not one combined check.
- **Login validation must differ from registration validation.** Reusing the strict registration schema (which requires `name`, `age`, `gender`, etc., and enforces password strength) for login would incorrectly reject valid login attempts, since a login body only contains `email` + `password`, and a correct existing password shouldn't be re-judged against current strength rules.
- **Without a centralized error handler, unhandled errors leak raw stack traces and full file system paths** to the client as HTML — confirmed directly by triggering a duplicate-key MongoDB error before Stage 2 was built, which returned a full `MongoServerError` stack trace including local file paths in the response body. This is a real security concern, not just a cosmetic one.

### Authentication-specific issues
- **Mongoose 9 removed `next()` callbacks from `pre()` hooks entirely.** Code that worked in Mongoose 8 (`schema.pre("save", function(next) { ...; next(); })`) throws `TypeError: next is not a function` in Mongoose 9, since `next` is no longer passed as an argument. The fix is to use a plain `async function()` with no `next` parameter, and just `return`/`throw` instead of calling a callback.
- **The `Authorization` header must be formatted exactly as `Bearer <token>`**, with the literal word "Bearer" and a single space before the token. Pasting just the raw token (or the wrong value, like the JWT secret itself) causes two different, easily-confused failures: no "Bearer " prefix → `"Not authorized, no token provided"`; a malformed token value → `"Invalid token, please log in again"` (`jwt malformed`).
- **`select: false` on the `password` field affects queries (`find`, `findById`, `findOne`) but not documents already in memory** (e.g. the result of `.create()`). The password must still be manually stripped from the response object in the controller before sending it back, even with `select: false` set on the schema.

## Technologies & Topics Covered

| Category | Details |
|---|---|
| Runtime | Node.js |
| Framework | Express.js 5 |
| Database | MongoDB (local instance via `mongod` / MongoDB Compass) |
| ODM | Mongoose 9 |
| Validation | Zod (schema-based input validation) |
| Authentication | JSON Web Tokens (`jsonwebtoken`) |
| Password security | bcrypt (hashing + salting) |
| Architecture | Layered: Router → Middleware → Controller → Service → Model |
| Error handling | Centralized error-handling middleware, custom `AppError` class, `asyncHandler` wrapper |
| Concepts | CRUD operations, REST API design, middleware, environment variables (`dotenv`), MongoDB ObjectIds, schema design, Mongoose pre-save hooks, HTTP status codes, request/response lifecycle, authentication vs. authorization |
| Testing tool | Postman (manual API testing) |

## Prerequisites

Before running this project, make sure you have:

1. **Node.js** installed (check with `node -v` in your terminal)
2. **MongoDB Compass** installed, and a local MongoDB server (`mongod`) running
   - Open Compass and confirm it can connect to `mongodb://localhost:27017`
   - Make sure the `Practice` database exists, with `users` and `blogs` collections (lowercase)
3. **Postman** (or any REST client) installed, to send test requests
4. Project dependencies installed via `npm install`
5. A `.env` file in the project root containing:
   ```
   JWT_SECRET=a_long_random_secret_string
   JWT_EXPIRES_IN=1d
   ```
   Generate a strong `JWT_SECRET` with:
   ```bash
   node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
   ```

## How to Start the Project

1. Open a terminal and navigate to the project root (where `index.js` lives).
2. Install dependencies:
   ```bash
   npm install
   ```
3. Make sure MongoDB is running locally (open MongoDB Compass and confirm it connects to `localhost:27017`).
4. Confirm `.env` exists with `JWT_SECRET` and `JWT_EXPIRES_IN` set.
5. Start the server:
   ```bash
   node index.js
   ```
   or, for auto-restart on file changes during development:
   ```bash
   npm start
   ```
   (uses `nodemon`, as configured in `package.json`)
6. Confirm in the terminal you see:
   ```
   Server running at PORT: 8089
   Connected to MongoDB
   Connected to database: Practice
   ```
7. Open Postman and start sending requests to `http://localhost:8089/api/v1/auth`, `/api/v1/users`, or `/api/v1/blogs`.

## Data Flow

For anyone new to this project, here's the order to read the code in to understand how a single request flows through the system:

```
1. index.js
   → loads .env FIRST, sets up Express, connects to MongoDB, mounts routers,
     registers the centralized error handler LAST

2. Router/*.js
   → defines each endpoint (POST, GET, PUT, DELETE) and which
     middleware + controller function handles it, in order

3. Middleware/*.js
   → protect        → verifies JWT (only on routes that require auth)
   → validateId      → checks a URL :id param is a valid ObjectId
   → validateBody     → validates req.body against a Zod schema
   → any of these can short-circuit the request early with an error

4. Controller/*.js
   → wrapped in asyncHandler; calls the matching Service function;
     throws AppError for "not found" cases; shapes the success response

5. Services/*.js
   → pure business logic; talks directly to the Mongoose Model;
     throws AppError for business-rule failures (e.g. duplicate email)

6. Models/*.js
   → Mongoose schema (fields, types, required rules, unique indexes);
     Users.Model.js also hashes passwords via a pre-save hook

7. MongoDB
   → the data is actually read from / written to disk here

8. Middleware/errorHandler.js
   → if ANY step above throws or rejects, asyncHandler forwards it here;
     formats a consistent { success: false, error: "..." } JSON response
     with the correct HTTP status code
```

### Example — a real, full request/response trace: updating a user

This is exactly what happens when a logged-in user sends:
```
PUT /api/v1/users/6a5f4e48ebc14e7257a8c161
Headers: Authorization: Bearer eyJhbGciOiJIUzI1NiIs...
Body: { "age": 30 }
```

```
1. Request hits UserActivityRouter's PUT "/:id" route

2. protect middleware runs first:
   - reads the Authorization header, extracts the token after "Bearer "
   - jwt.verify(token, JWT_SECRET) -> decodes { id: "6a5f4e48ebc14e7257a8c161", iat, exp }
   - User.findById(decoded.id) -> confirms this user still exists
   - attaches the found user to req.user
   - calls next()

3. validateId middleware runs next:
   - checks "6a5f4e48ebc14e7257a8c161" is a valid 24-char hex ObjectId -> true
   - calls next()

4. validateBody(validateUserUpdate) middleware runs next:
   - runs { age: 30 } through the PARTIAL Zod schema (all fields optional)
   - passes validation (age is a valid number within range)
   - sets req.validatedBody = { age: 30 }
   - calls next()

5. updateUser controller runs (wrapped in asyncHandler):
   - calls UserService.updateUser("6a5f4e48ebc14e7257a8c161", { age: 30 })

6. UserService.updateUser runs:
   - calls User.findByIdAndUpdate(id, { age: 30 }, { new: true, runValidators: true })
   - Mongoose re-validates the update against the schema, then writes to MongoDB
   - returns the updated document

7. Back in the controller:
   - if no document was found, throw new AppError("User not found", 404)
   - otherwise, res.status(200).json(user)

8. Postman receives:
   { "_id": "...", "name": "...", "age": 30, ...no password field..., "updatedAt": "..." }
```

**If ANY step above fails** (e.g. missing token, invalid ID, failed validation, duplicate email, user not found, database error), the flow instead jumps straight to `errorHandler`, which returns something like:
```json
{ "success": false, "error": "Not authorized, no token provided." }
```
with the appropriate status code (`401`, `400`, or `404` depending on what failed) — the client never sees a raw stack trace or an inconsistent error shape, regardless of which layer the failure happened in.

## Folder Structure

```
MVC_2/
├── Controller/
│   ├── AuthController.js
│   ├── UserActivityController.js
│   └── BlogActivityController.js
├── Middleware/
│   ├── authMiddleware.js
│   ├── errorHandler.js
│   ├── validateBody.js
│   └── validateId.js
├── Models/
│   ├── Users.Model.js
│   └── Blogs.Model.js
├── Router/
│   ├── AuthRouter.js
│   ├── UserActivityRouter.js
│   └── BlogActivityRouter.js
├── Services/
│   ├── AuthService.js
│   ├── UserService.js
│   └── BlogService.js
├── Validator/
│   ├── AuthValidation.js
│   ├── UserInputValidation.js
│   └── BlogInputValidation.js
├── utils/
│   ├── AppError.js
│   ├── asyncHandler.js
│   ├── generateToken.js
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
| `index.js` | Entry point — loads `.env`, creates the Express app, applies global middleware, mounts routers, connects to MongoDB, registers the centralized error handler last, starts the server |
| `Router/AuthRouter.js` | Defines `/api/v1/auth/register` and `/api/v1/auth/login`, wired with validation middleware |
| `Router/UserActivityRouter.js` | Defines all `/api/v1/users` endpoints; `PUT`/`DELETE` require `protect` |
| `Router/BlogActivityRouter.js` | Defines all `/api/v1/blogs` endpoints; `PUT`/`DELETE` require `protect` |
| `Middleware/validateBody.js` | Reusable middleware factory — takes a Zod validator function, checks `req.body`, sets `req.validatedBody` |
| `Middleware/validateId.js` | Checks `req.params.id` is a well-formed MongoDB ObjectId |
| `Middleware/authMiddleware.js` (`protect`) | Verifies a JWT from the `Authorization` header, attaches the authenticated user to `req.user` |
| `Middleware/errorHandler.js` | Centralized error handler (4-arg Express middleware) — formats every error into consistent JSON with the correct status code |
| `Controller/AuthController.js` | Handles `register`/`login` — calls `AuthService`, strips passwords, returns user + token |
| `Controller/UserActivityController.js` | Handles the HTTP layer for Users — calls `UserService`, throws `AppError` on not-found |
| `Controller/BlogActivityController.js` | Same as above, for Blogs |
| `Services/AuthService.js` | Business logic for register/login — checks for duplicate emails, verifies passwords via bcrypt, issues tokens |
| `Services/UserService.js` | Business logic for Users — talks directly to the Mongoose `User` model |
| `Services/BlogService.js` | Same as above, for Blogs |
| `Models/Users.Model.js` | Mongoose schema for a User document; hashes password via `pre("save")` hook; `password` field excluded by default (`select: false`); has a `comparePassword` instance method |
| `Models/Blogs.Model.js` | Mongoose schema for a Blog document |
| `Validator/UserInputValidation.js` | Zod schemas for Users — strict version for create, `.partial()` version for update |
| `Validator/BlogInputValidation.js` | Same, for Blogs |
| `Validator/AuthValidation.js` | Zod schema for login — deliberately simpler than the registration schema |
| `utils/asyncHandler.js` | Wraps async controller functions; forwards any thrown/rejected error to Express's `next()` |
| `utils/AppError.js` | Custom `Error` subclass carrying an HTTP `statusCode`, used to throw intentional, known errors from anywhere in the app |
| `utils/generateToken.js` | Signs a JWT containing the user's ID, using `JWT_SECRET` |
| `utils/validateObjectId.js` | Checks if a string could be a valid MongoDB ObjectId |
| `.env` | Stores environment variables (`JWT_SECRET`, `JWT_EXPIRES_IN`) — never commit this file |

## Expected Inputs

### Register — `POST /api/v1/auth/register`
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

### Login — `POST /api/v1/auth/login`
```json
{
  "email": "priya.nair@example.com",
  "password": "Priya@2026"
}
```

### Create a User — `POST /api/v1/users`
Same shape as register (no auth required for this route currently).

### Update a User — `PUT /api/v1/users/:id` *(requires `Authorization: Bearer <token>`)*
```json
{ "age": 27 }
```

### Create a Blog — `POST /api/v1/blogs`
```json
{
  "title": "Why I Switched to a Standing Desk",
  "content": "After months of back pain, I finally tried a standing desk.",
  "author": "Priya Nair",
  "category": "Lifestyle",
  "tags": ["health", "productivity"],
  "likes": 0,
  "views": 0,
  "published": true
}
```

### Update a Blog — `PUT /api/v1/blogs/:id` *(requires `Authorization: Bearer <token>`)*
```json
{ "likes": 15 }
```

## Expected Outputs

### Successful register/login (`201` / `200`)
```json
{
  "success": true,
  "user": {
    "_id": "6a6ddc26aed3a512e6ad6aba",
    "name": "Priya Nair",
    "email": "priya.nair@example.com",
    "age": 26,
    "gender": "Female",
    "contact": "9123456780",
    "nationality": "Indian",
    "createdAt": "2026-08-01T11:44:38.061Z",
    "updatedAt": "2026-08-01T11:44:38.061Z",
    "__v": 0
  },
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```
Note: `password` is never present in the response.

### Validation failure (`400`)
```json
{ "error": ["Please enter a valid email address.", "Contact must be a 10-digit number."] }
```

### Missing/invalid token (`401`)
```json
{ "success": false, "error": "Not authorized, no token provided." }
```
or
```json
{ "success": false, "error": "Invalid token. Please log in again." }
```

### Wrong login credentials (`401`)
```json
{ "success": false, "error": "Invalid email or password." }
```

### Duplicate unique field (`400`)
```json
{ "success": false, "error": "Duplicate value for field: email" }
```

### Document not found (`404`)
```json
{ "success": false, "error": "User not found" }
```

### Successful deletion (`200`)
```json
{ "message": "User deleted successfully" }
```

## Where to Send Requests & Check Responses

- **Send requests from:** Postman (Method + URL + Body tab set to raw/JSON; for protected routes, set the `Authorization` header to `Bearer <token>`, or use Postman's Authorization tab → Bearer Token)
- **Base URL:** `http://localhost:8089`
- **Endpoints:**

  | Method | Endpoint | Auth required? | Purpose |
  |---|---|---|---|
  | POST | `/api/v1/auth/register` | No | Create account, get token |
  | POST | `/api/v1/auth/login` | No | Log in, get token |
  | POST | `/api/v1/users` | No | Create a user |
  | GET | `/api/v1/users` | No | Get all users |
  | GET | `/api/v1/users/:id` | No | Get one user |
  | PUT | `/api/v1/users/:id` | **Yes** | Update a user |
  | DELETE | `/api/v1/users/:id` | **Yes** | Delete a user |
  | POST | `/api/v1/blogs` | No | Create a blog |
  | GET | `/api/v1/blogs` | No | Get all blogs |
  | GET | `/api/v1/blogs/:id` | No | Get one blog |
  | PUT | `/api/v1/blogs/:id` | **Yes** | Update a blog |
  | DELETE | `/api/v1/blogs/:id` | **Yes** | Delete a blog |

- **Check the response:** Postman's response panel, "Body" tab
- **Check the raw data:** MongoDB Compass → `Practice` database → `users`/`blogs` collections, or `db.users.find().pretty()` in `mongosh`
- **Check server-side logs/errors:** The terminal running `node index.js` / `npm start` — the `errorHandler` logs every error server-side via `console.error(err)` even though the client only sees the formatted message

## Pending Topics / Not Yet Implemented

These are the natural next steps to extend this project further, roughly in suggested order:

1. **Ownership-based authorization** — currently, *any* logged-in user can update/delete *any* user or blog, not just their own. `req.user` is already available from `protect`, but nothing yet compares `req.user._id` against the resource being modified.
2. **Role-based access control** — e.g. an "admin" role that can manage all resources, vs. a regular user restricted to their own — not implemented at all.
3. **Relationships between resources** — `Blog.author` is still a plain string, not linked to a real `User` document via `mongoose.Schema.Types.ObjectId` + `.populate()`.
4. **Pagination, filtering, sorting** — `GET /api/v1/users` and `GET /api/v1/blogs` always return every document; no `?page=`, `?limit=`, `?sort=`, or query-based filtering yet.
5. **Logout / token invalidation** — tokens simply expire after `JWT_EXPIRES_IN`; there's no way to manually invalidate one early (no blacklist or refresh-token pattern).
6. **Security middleware** — `cors` (restrict which frontend origins can call the API), `helmet` (secure HTTP headers), rate limiting on login attempts (brute-force protection).
7. **Config validation at startup** — the app doesn't currently verify required `.env` variables exist before starting; a missing `JWT_SECRET` currently only fails later, when a token is generated, rather than immediately at boot.
8. **Logging** — no HTTP request logging (`morgan`) or structured application logs (`winston`/`pino`) yet.
9. **Automated testing** — no unit tests (Jest/Vitest) for services/validators, and no integration tests (Supertest) for full routes.
10. **API documentation** — no Swagger/OpenAPI spec; this README is currently the only reference for available endpoints.