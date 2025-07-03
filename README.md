# ATS Server Setup

## Prerequisites
- Node.js installed
- PostgreSQL installed and running

## Setup Instructions

1. Clone the repository
2. Navigate to server directory: `cd server`
3. Install dependencies: `npm install`
4. Copy `.env.example` to `.env` and fill in your database credentials
5. Set up the database: `npm run db:setup`
6. Start the development server: `npm run dev`

## Available Scripts

- `npm run db:setup` - Creates database, runs migrations and seeds
- `npm run db:reset` - Resets database (drops all tables and recreates)
- `npm run db:fresh` - Completely fresh database (drops database and recreates)
- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm start` - Start production server

## For Development
Just run: `npm run db:setup` once, then `npm run dev`