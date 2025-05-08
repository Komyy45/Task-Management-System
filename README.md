# Task Management System

A full-stack task management application built with Angular and Node.js.

## Project Structure

- **Client**: Angular frontend application
- **Server**: Node.js backend API

## Features

- User authentication (login/register)
- Task management (create, read, update, delete)
- Task filtering and pagination
- User profile management
- Dashboard with task statistics

## Technologies Used

### Frontend
- Angular 16+
- Angular Router
- Angular Forms (Reactive)
- Bootstrap
- RxJS

### Backend
- Node.js
- Express
- MongoDB
- JWT Authentication

## Getting Started

### Prerequisites
- Node.js (v14+)
- npm (v6+)
- MongoDB

### Installation

1. Clone the repository
```
git clone https://github.com/yourusername/task-management-system.git
cd task-management-system
```

2. Install backend dependencies
```
cd Server
npm install
```

3. Configure environment variables
Create a `.env` file in the Server directory with the following variables:
```
PORT=5000
DATABASE_CONNECTION=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret
```

4. Install frontend dependencies
```
cd ../Client/Task_Management_System
npm install
```

5. Start the backend server
```
cd ../../Server
npm start
```

6. Start the frontend application
```
cd ../Client/Task_Management_System
ng serve
```

7. Open your browser and navigate to `http://localhost:4200`

## API Endpoints

### Authentication
- `POST /api/auth/register` - Register a new user
- `POST /api/auth/login` - Login a user
- `GET /api/auth/user` - Get current user profile

### Tasks
- `GET /api/task` - Get all tasks (with pagination)
- `GET /api/task/:id` - Get a specific task
- `POST /api/task` - Create a new task
- `PUT /api/task/:id` - Update a task
- `DELETE /api/task/:id` - Delete a task
- `GET /api/task/categories` - Get task categories
- `GET /api/task/stats` - Get task statistics
- `GET /api/task/summary` - Get task summary

## License

This project is licensed under the MIT License.
