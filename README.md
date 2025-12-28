# Collaborative Task Manager

A full-stack real-time task management application built with React, Node.js, Express, MongoDB, and Socket.io.

## Live Demo

- **Frontend**: https://task-manager-beta-seven-73.vercel.app, https://cotask.netlify.app
- **Backend API**: https://taskmanager-ddip.onrender.com

## Features

### Core Requirements ✅

- [x] **User Authentication** - JWT-based registration and login
- [x] **Task CRUD Operations** - Create, read, update, and delete tasks
- [x] **Real-time Collaboration** - Socket.io for live updates across clients
- [x] **Dashboard** - Task statistics, filtering, and sorting

### Technical Implementation ✅

- [x] **Frontend**: React 19 + Vite + TypeScript + Tailwind CSS v4
- [x] **Backend**: Node.js + Express 5 + TypeScript
- [x] **Database**: MongoDB with Mongoose ODM
- [x] **Real-time**: Socket.io for WebSocket communication
- [x] **Authentication**: JWT tokens with secure password hashing (bcrypt)
- [x] **Validation**: Zod v4 for request validation

### Features Implemented ✅

- [x] User registration and login
- [x] Task creation with title, description, status, priority, due date, assignee
- [x] Task status: Todo, In Progress, Review, Completed
- [x] Task priority: Low, Medium, High, Urgent
- [x] Kanban board view with drag-and-drop status changes
- [x] List view with sortable columns
- [x] Task filtering by status and priority
- [x] Sorting by due date (ascending/descending)
- [x] Real-time task updates via Socket.io
- [x] Real-time notifications when tasks are assigned
- [x] Notification bell with unread count
- [x] Responsive design for mobile and desktop
- [x] Error handling with proper HTTP status codes

## Tech Stack

| Layer | Technology |
|-------|------------|
| Frontend | React 19, Vite, TypeScript, Tailwind CSS v4 |
| Backend | Node.js, Express 5, TypeScript |
| Database | MongoDB, Mongoose |
| Real-time | Socket.io |
| Auth | JWT, bcrypt |
| Validation | Zod v4 |
| Deployment | Vercel (Frontend), Render (Backend) |

## Project Structure

```
├── frontend/                # React frontend
│   ├── src/
│   │   ├── components/      # UI components
│   │   │   ├── layout/      # Layout components (Navbar, Layout)
│   │   │   ├── notifications/ # NotificationBell
│   │   │   ├── tasks/       # Task components (TaskCard, TaskForm, KanbanBoard)
│   │   │   └── ui/          # Reusable UI (Button, Input, Modal, Select)
│   │   ├── context/         # React context (AuthContext)
│   │   ├── lib/             # API and socket utilities
│   │   ├── pages/           # Page components (Login, Register, Dashboard)
│   │   └── types/           # TypeScript types
│   └── ...
├── backend/                 # Express backend
│   ├── src/
│   │   ├── config/          # Configuration
│   │   ├── controllers/     # Route controllers
│   │   ├── dtos/            # Data transfer objects (Zod schemas)
│   │   ├── middlewares/     # Express middlewares
│   │   ├── models/          # Mongoose models
│   │   ├── repositories/    # Database operations
│   │   ├── routes/          # API routes
│   │   ├── services/        # Business logic
│   │   ├── sockets/         # Socket.io handlers
│   │   └── utils/           # Utilities (ApiResponse, ApiError, etc.)
│   └── ...
└── README.md
```

## API Endpoints

### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login user

### Users
- `GET /api/users` - Get all users
- `GET /api/users/me` - Get current user

### Tasks
- `GET /api/tasks` - Get all tasks (with filters)
- `POST /api/tasks` - Create task
- `GET /api/tasks/:id` - Get task by ID
- `PUT /api/tasks/:id` - Update task
- `DELETE /api/tasks/:id` - Delete task

### Notifications
- `GET /api/notifications` - Get user notifications
- `PATCH /api/notifications/:id/read` - Mark notification as read

## Socket.io Events

| Event | Direction | Description |
|-------|-----------|-------------|
| `register` | Client → Server | Register user for notifications |
| `taskCreated` | Server → Client | New task created |
| `taskUpdated` | Server → Client | Task updated |
| `taskDeleted` | Server → Client | Task deleted |
| `taskAssigned` | Server → Client | Task assigned to user |

## Local Development

### Prerequisites
- Node.js 20.x
- MongoDB instance
- npm or yarn

### Backend Setup
```bash
cd backend
npm install
cp .env.example .env  # Configure environment variables
npm run dev
```

### Frontend Setup
```bash
cd frontend
npm install
npm run dev
```

### Environment Variables

#### Backend (.env)
```
PORT=5000
NODE_ENV=development
MONGO_URI=mongodb://localhost:27017/taskmanager
JWT_SECRET=your-secret-key
JWT_EXPIRES_IN=7d
CORS_ORIGIN=http://localhost:5173 || https://cotask.netlify.app ||https://task-manager-beta-seven-73.vercel.app
```

#### Frontend (.env)
```
VITE_API_URL=http://localhost:5000
VITE_SOCKET_URL=http://localhost:5000
```

## Deployment

### Backend (Render)
- Build Command: `npm install --include=dev && tsc`
- Start Command: `npm start`
- Environment variables configured in Render dashboard

### Frontend (Vercel)
- Framework: Vite
- Build Command: `npm run build`
- Output Directory: `dist`
- Environment variables configured in Vercel dashboard

## Submission Checklist

- [x] User authentication (register/login)
- [x] Task CRUD operations
- [x] Real-time updates with Socket.io
- [x] Dashboard with statistics
- [x] Task filtering and sorting
- [x] Kanban board view
- [x] Drag-and-drop status changes
- [x] Real-time notifications
- [x] Responsive design
- [x] TypeScript throughout
- [x] Proper error handling
- [x] Clean code architecture
- [x] Deployed and accessible
