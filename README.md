Inhouse E-Shop
Inhouse E-Shop is an e-commerce platform built using Node.js and Express with TypeScript. This guide will help you set up the project and run it locally on your machine.

Prerequisites
Before you begin, make sure you have the following installed:

Node.js (Version 14.x or higher)
npm (Node Package Manager, installed with Node.js)
Git (for cloning the repository)
Check your installed versions:

bash
Copy code
node -v
npm -v
git --version
Getting Started
Follow the steps below to get the project running locally.

1. Clone the Repository
Clone the repository to your local machine:

bash
Copy code
git clone https://github.com/Pratik667/inhouse-eshop.git
2. Navigate to the Project Directory
Go into the project folder:

bash
Copy code
cd inhouse-eshop
3. Install Dependencies
Install all the required dependencies using npm:

bash
Copy code
npm install
This will install all the packages listed in the package.json file, including both production and development dependencies.

4. Set Up Environment Variables
Create a .env file in the root directory of the project if it doesn’t exist. Add your environment variables like database connection strings, JWT secret keys, etc.

Example .env:

env
Copy code
PORT=3000
DB_HOST=localhost
DB_USER=root
DB_PASS=password
SECRET_KEY=your_secret_key
JWT_SECRET=your_jwt_secret
Note: Ensure you have the correct MongoDB connection string if using MongoDB.

5. Run the Application
To run the application locally, use the following command to start the server in development mode:

bash
Copy code
npm run dev
This will run the server with Nodemon (to automatically restart on file changes) and compile TypeScript files from src into JavaScript. The server will be accessible at http://localhost:3000.

6. Running in Production Mode
To build and run the app in production mode, use the following commands:

Build the TypeScript files into JavaScript:

bash
Copy code
npm run build
Start the app using Node.js:

bash
Copy code
npm start
The app will be running on the specified port (e.g., http://localhost:3000).

7. Test Routes
Here’s an overview of the available routes:

User Routes
POST /api/users/register: Register a new user.
POST /api/users/login: Login a user.
GET /api/users/all-users: Get all users (Admin only).
PATCH /api/users/update-user/:userId: Update a user (Admin only).
DELETE /api/users/delete-user/:userId: Delete a user (Admin only).
GET /api/users/team-users: Get users in the same team (Managers only).
Product Routes
POST /api/products: Create a new product (Admin or Manager only).
GET /api/products: Get all products.
GET /api/products/:id: Get a product by ID.
PUT /api/products/:id: Update a product (Admin or Manager only).
DELETE /api/products/:id: Delete a product (Admin or Manager only).
Note: Ensure that you have the correct authentication (JWT tokens) to access protected routes like the admin and manager routes.

Project Structure
Here's a brief overview of the project structure:

/src: Contains all the source code (TypeScript files).
/controllers: Contains controller functions for handling route logic.
/models: Contains MongoDB models for users, products, etc.
/routes: Contains route definitions for users and products.
/middleware: Contains middlewares for verifying JWT tokens and role-based authorization.
/dist: Compiled JavaScript code (generated during build).
/config: Configuration files like environment variables and DB setup.
Technologies Used
Node.js: JavaScript runtime for server-side code.
Express.js: Web framework for routing and handling HTTP requests.
MongoDB: Database for storing user and product data.
JWT: For token-based authentication.
TypeScript: For type-safe development.
Nodemon: For automatically restarting the server during development.
bcryptjs: For password hashing.
dotenv: For environment variable management.
Troubleshooting
Port Already in Use: If you encounter a "port already in use" error, stop the application running on that port or change the port in the .env file.

Missing Dependencies: If dependencies are missing or errors occur, delete the node_modules folder and package-lock.json, then reinstall dependencies:

bash
Copy code
rm -rf node_modules package-lock.json
npm install
Contributing
If you'd like to contribute to this project, feel free to fork the repository and submit a pull request. Please follow the project's code style and include relevant tests.

License
This project is licensed under the MIT License - see the LICENSE file for details.
