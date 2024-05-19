# Chat Application

This chat application enables real-time messaging between users. Built using React with Next.js for the frontend and Node.js with Express and Socket.io for the backend, it supports multiple users across different chat rooms.

## Features

- **User Authentication**: Enter a username to identify yourself.
- **Room Management**: Create or join existing chat rooms.
- **Real-Time Messaging**: Communicate with others in your room in real time.

## Prerequisites

Before you begin, ensure you have met the following requirements:
- Node.js (version 12.x or higher)
- pnpm (This project uses pnpm for efficient dependency management)

## Installation

Clone the repository to your local machine and install the dependencies:

```bash
git clone https://github.com/your-username/your-repository-name.git
cd chat-application
pnpm install
```
# Running the Application

To run the application locally, you need to start both the backend and the frontend servers.

# Start the Backend Server

Navigate to the backend directory and start the server:

```bash
cd backend
pnpm start
```

# Start the Frontend Server

In a new terminal window, navigate to the frontend directory and start the frontend server:

```bash
cd frontend
pnpm start
```

Visit http://localhost:3000 in your browser to see the application in action.

# Technologies Used

- **Frontend**: Next.js
- **Backend**: Node.js, Express, Socket.io
- **Package Manager**: pnpm
- **Code Linting**: ESLint(Airbnb's style guide)

# Design Decisions

- **Socket.io**: Chosen for its ease of setup and robust handling of WebSocket connections for real-time communication.
- **Next.js**: Chosen for its rapid development and user-friendly design.
- **pnpm**: Selected for efficient node module management, reducing installation times and disk space usage compared to npm.

# Additional Notes

- The backend manages WebSocket connections and serves as the communication relay between users in different chat rooms.
- The frontend is responsive, ensuring a consistent experience across various devices and screen sizes.
- The entire system is stateless, enabling real-time messaging between users in different chat rooms.

# Deployment

- **Frontend**: Frontend is deployed on Vercel. Visit https://chat-application-644q4f7mx-r-katochs-projects.vercel.app/ to see the application in action.
- **Backend**: Backend is deployed on Render. 

# Thank you for using this project.
