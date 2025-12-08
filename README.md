# Library Management System – Expernetic Internship Assignment

Full-stack Library Management System built with **ASP.NET Core 10** and **React 19 + TypeScript**.

## Features Delivered
- Complete Book CRUD operations (Create · Read · Update · Delete)
- User registration & login with **JWT authentication** and **BCrypt password hashing**
- Strong password validation (8+ chars, uppercase, lowercase, number, special char) with real-time feedback
- Public book catalog (GET endpoints are anonymous)
- Only authenticated users can add, edit or delete books
- Modern, fully responsive UI with Tailwind CSS v4, gradients, cards, modals and loading states
- Swagger API documentation with XML comments
- Clean architecture and comprehensive code comments

## Tech Stack
**Backend**  
ASP.NET Core 10 · Entity Framework Core 10 · SQLite · JWT · BCrypt · Swagger + XML comments  

**Frontend**  
React 19 · TypeScript · Vite · Tailwind CSS v4 · React Query · Axios · React Hot Toast

## Prerequisites (one-time only)
- [.NET 10 SDK](https://dotnet.microsoft.com/en-us/download/dotnet/10.0)
- [Node.js 20 or newer](https://nodejs.org)

Tested and working on macOS, Windows

## How to Run 
```bash
# 1. Clone the repository
git clone https://github.com/Abhishke391/LibraryManagementSystem.git
cd LibraryManagementSystem

# 2. Start the Backend (.NET API)
cd backend/LibraryApi
dotnet run
# → API runs at http://localhost:5xxx (port shown in console)
# → Swagger available at http://localhost:5xxx/swagger

# 3. Start the Frontend (React + Vite) – open a new terminal
cd ../../frontend
npm install
npm run dev
# → Opens http://localhost:5173

