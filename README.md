# Abe Garage Project

## Project Overview

Abe Garage is a full-stack web application designed to manage garage services. The platform allows administrators to register both **customers** and **employees**. After registration, customers and employees can log in to the system. Customers can:
- Order services,
- Assign employees to handle their orders,
- Track the status of their orders.

Administrators have full control over user management, including assigning roles and managing service orders.

## Features

- **Admin Management**: Admins can register customers and employees, manage services, and oversee orders.
- **Customer Orders**: Customers can place service orders, track their progress, and assign employees to orders.
- **Employee Dashboard**: Employees can view and manage their assigned orders.
- **Order Tracking**: Customers can monitor the status of their ongoing service orders.

## Tech Stack

### Backend
- **Node.js** and **Express.js** for the server.
- **MySQL** as the database.
- **JWT** for authentication and **bcrypt** for password encryption.

### Frontend
- **React.js** for the user interface.
- **Tailwind CSS**, **Bootstrap**, and custom CSS for styling.
- **React Router** for navigation.
- **Axios** for making HTTP requests.

### Additional Tools
- **Concurrently** to run the frontend and backend simultaneously during development.
- **Vite** for fast frontend development and build process.

## Installation and Setup

### Prerequisites
Ensure you have the following installed:
- [Node.js](https://nodejs.org/)
- [MySQL](https://www.mysql.com/)

### Backend Setup

1. Clone the repository:
   ```bash
   git clone https://github.com/LidoHon/AbeGarage.git
2. Navigate to the backend directory:
   ```bash
   cd AbeGarage/backend
3.Install backend dependencies:
  ```bash
   npm install
```
4. Configure the .env file with your MySQL credentials:
      DB_USER=your_username
      DB_PASSWORD=your_password
      DB_NAME=your_database_name
5.Start the backend server:
 ```bash
  npm start
```

### Frontend Setup

1. Navigate to the frontend directory:
   ```bash
   cd ../frontend
   ```
2.Install frontend dependencies:
```bash
npm install
```
3.Start the frontend development server:
```bash
npm run dev
```
### Running Both Backend and Frontend Concurrently
You can run both the backend and frontend together using the concurrently package. In the root directory of the project, use the following command:
```bash
npm run dev
```
This will start both the frontend and backend servers concurrently.

### Package Information
### Backend Dependencies
Here are some key backend dependencies from the package.json file:

- express: "^4.19.2"
- bcrypt: "^5.1.1"
- cookie-parser: "^1.4.6"
- cors: "^2.8.5"
- dotenv: "^16.4.5"
- jsonwebtoken: "^9.0.2"
- mysql2: "^3.11.0"
- sanitize: "^2.1.2"

### Frontend Dependencies
Some key frontend dependencies from the package.json file include:

- axios: "^1.7.7"
- react: "^18.3.1"
- react-router-dom: "^6.26.1"
- react-toastify: "^10.0.5"
- tailwindcss: "^3.4.10"
- vite: "^5.4.1"
### Contribution
This project is currently under development, and contributions are welcome!

### How to Contribute
1.Fork tor clone thebrepository
```bash  
git clone https://github.com/LidoHon/AbeGarage.git
```
2. Create a new feature branch:
```bash
git checkout -b feature-name
```
3. Make your changes and commit them:
```bash
git commit -m "Description of changes"
```
4. Push your changes to your fork:
```bash
git push origin feature-name
```
5. Open a pull request to the main repository.
