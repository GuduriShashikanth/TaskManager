# Collaborative Task Manager

A full-stack real-time collaborative task management application built with React, Node.js, Express, MongoDB, and Socket.io.

## Features

### Authentication
- User registration and login with JWT
- Secure password hashing with bcrypt
- Protected routes with middleware

### Task Management
- Create, read, update, and delete tasks
- Task properties: title, description, status, priority, due date, assignee
- Status options: Todo, In Progress, Review, Completed
- Priority levels: Low, Medium, High, Urgent
- Drag-and-drop Kanban board for status changes
- List view with sorting and filtering

### Real-time Collaboration
- Socket.io for real-time updates
- Live task updates across all connected clients
- Real-time notifications when tasks are assigned
- Notification bell with unread count

### Dashboard
- Task statistics (total, todo, in progress, completed)
- Filter by status and priority
- Sort by due date
- Responsive design for mobile and desktop

## Tech Stack

### Frontend
- React 19 with TypeScript
- Vite for build tooling
- Tailwind CSS for styling
- Socket.io-client for real-time updates
- Axios for HTTP requests

### Backend
- Node.js with Express 5
- TypeScript
- MongoDB with Mongoose
- Socket.io for WebSocket connections
- JWT for authentication
- Zod for validation
- bcrypt for password hashing

## Project Structure

```
├── backend/
│   ├── src/
│   │   ├── config/          # Environment configuration
│   │   ├── controllers/     # Route handlers
│   │   ├── dtos/            # Data transfer objects (Zod schemas)
│   │   ├── middlewares/     # Express middlewares
│   │   ├── models/          # Mongoose models
│   │   ├── repositories/    # Database operations
│   │   ├── routes/          # API routes
│   │   ├── services/        # Business logic
│   │   ├── sockets/         # Socket.io handlers
│   │   ├── utils/           # Utilities and helpers
│   │   └── index.ts         # Entry point
│   └── package.json
├── frontend/
│   ├── src/
│   │   ├── components/      # React components
│   │   ├── context/         # React context providers
│   │   ├── lib/             # API and socket utilities
│   │   ├── pages/           # Page components
│   │   ├── App.tsx          # Main app component
│   │   └── main.tsx         # Entry point
│   └── package.json
└── README.md
```

## Getting Started

### Prerequisites
- Node.js 18+
- MongoDB (local or Atlas)

### Backend Setup

1. Navigate to backend directory:
```bash
cd backend
```

2. Install dependencies:
```bash
npm install
```

3. Create `.env` file:
```env
PORT=5000
NODE_ENV=development
MONGO_URI=mongodb://localhost:27017/taskmanager
JWT_SECRET=your-super-secret-jwt-key
JWT_EXPIRES_IN=7d
CORS_ORIGIN=http://localhost:5173
```

4. Start development server:
```bash
npm run dev
```

### Frontend Setup

1. Navigate to frontend directory:
```bash
cd frontend
```

2. Install dependencies:
```bash
npm install
```

3. Create `.env` file:
```env
VITE_API_URL=http://localhost:5000
VITE_SOCKET_URL=http://localhost:5000
```

4. Start development server:
```bash
npm run dev
```

## API Endpoints

### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login user

### Users
- `GET /api/users/me` - Get current user profile
- `PUT /api/users/me` - Update profile
- `GET /api/users` - Get all users

### Tasks
- `GET /api/tasks` - List tasks (with filters)
- `POST /api/tasks` - Create task
- `PUT /api/tasks/:id` - Update task
- `DELETE /api/tasks/:id` - Delete task

### Notifications
- `GET /api/notifications` - Get user notifications
- `PATCH /api/notifications/:id/read` - Mark as read

## Socket Events

### Client to Server
- `register` - Register user socket connection

### Server to Client
- `taskCreated` - New task created
- `taskUpdated` - Task updated
- `taskDeleted` - Task deleted
- `taskAssigned` - Task assigned to user

## Scripts

### Backend
- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run typecheck` - Run TypeScript check

### Frontend
- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run lint` - Run ESLint

## Environment Variables

### Backend
| Variable | Description | Default |
|----------|-------------|---------|
| PORT | Server port | 5000 |
| NODE_ENV | Environment | development |
| MONGO_URI | MongoDB connection string | - |
| JWT_SECRET | JWT signing secret | - |
| JWT_EXPIRES_IN | JWT expiration | 7d |
| CORS_ORIGIN | Allowed CORS origin | http://localhost:5173 |

### Frontend
| Variable | Description | Default |
|----------|-------------|---------|
| VITE_API_URL | Backend API URL | http://localhost:5000 |
| VITE_SOCKET_URL | Socket.io URL | http://localhost:5000 |
