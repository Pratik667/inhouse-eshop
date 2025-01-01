# Inhouse E-Shop

Inhouse E-Shop is a modern e-commerce platform built with **Node.js**, **Express.js**, and **TypeScript**. This project allows users to register, login, manage products, and perform other e-commerce operations.

![Inhouse E-Shop](https://via.placeholder.com/800x200.png?text=Inhouse+E-Shop)

## 🚀 Table of Contents

- [Prerquisites](#prerequisites)
- [Getting Started](#getting-started)
- [Run the App Locally](#run-the-app-locally)
- [Routes](#routes)
- [Project Structure](#project-structure)
- [Technologies Used](#technologies-used)
- [Contributing](#contributing)
- [License](#license)

---

## 🛠️ Prerequisites

Before you begin, ensure you have the following installed on your local machine:

- **Node.js** (Version 14.x or higher)  
- **npm** (Node Package Manager)
- **Git** (for cloning the repository)

You can verify the installations by running:

```bash
node -v
npm -v
git --version

⚡ Getting Started
Follow the steps below to set up the project locally:

1. Clone the Repository
First, clone the repository to your local machine:

bash
Copy code
git clone https://github.com/Pratik667/inhouse-eshop.git
2. Install Dependencies
Navigate to the project directory and install all the required dependencies:

bash
Copy code
cd inhouse-eshop
npm install
🚀 Run the App Locally
1. Set Up Environment Variables
Create a .env file in the root directory and add the following variables:

env
Copy code
PORT=3000
DB_HOST=localhost
DB_USER=root
DB_PASS=password
SECRET_KEY=your_secret_key
JWT_SECRET=your_jwt_secret
Note: Make sure you set up a MongoDB instance or change the database settings as required.

2. Start the Development Server
For development, use Nodemon to automatically restart the server on file changes:

bash
Copy code
npm run dev
The app will be available at http://localhost:3000.

3. Build & Start the Production Server
For production, build the app and run it using Node.js:

bash
Copy code
npm run build
npm start
🛣️ Routes
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
🗂️ Project Structure
The project structure is organized into several key folders and files:

bash
Copy code
/src
  /controllers  # Logic for handling user and product routes
  /models       # Mongoose models for MongoDB
  /routes       # Routes for users and products
  /middleware   # Middleware for authentication and authorization
  /config       # Configuration files
/dist           # Compiled JavaScript code (after build)
🧑‍💻 Technologies Used
Node.js: Backend framework for server-side development.
Express.js: Web framework to handle HTTP requests and routing.
MongoDB: NoSQL database for storing user and product data.
JWT: For secure token-based authentication.
TypeScript: To provide strong typing and development experience.
Nodemon: For automatically restarting the app during development.
bcryptjs: For password hashing.
dotenv: For environment variable management.
🤝 Contributing
Contributions are welcome! Here's how you can help:

Fork the repository.
Create a new branch (git checkout -b feature-name).
Make your changes and commit them.
Push to the branch (git push origin feature-name).
Open a pull request.
Please ensure your code follows the project’s code style and includes tests.

📄 License
This project is licensed under the MIT License - see the LICENSE file for details.

🔗 Contact
Author: Pratik667
Email: pratik667@example.com (Optional)
