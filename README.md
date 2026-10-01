# Real-Time Collaborative Drawing (Hosted live on Azure)
## Link:  [https://collabdraw.nazimss.online]
A modern collaborative drawing platform built with Next.js and WebSocket technology.

## Features

- 🎨 Real-time drawing collaboration
- 🔄 Live canvas synchronization
- 🛠️ Drawing tools:
  - Rectangle
  - Circle
  - Line
  - Freehand drawing
- 🖐️ Canvas controls:
  - Pan
  - Zoom
  - Reset view
- 🔐 Secure authentication
- 🏠 Drawing rooms
- 🌙 Dark theme

## Technology Stack

- **Frontend**

  - Next.js 16
  - TypeScript
  - Tailwind CSS
  - Custom UI components
  - Canvas API

- **Backend**

  - Node.js
  - WebSocket server
  - Prisma ORM
  - PostgreSQL database

- **Development**
  - Turborepo
  - pnpm package manager
  - Azure Deployment

## Getting Started

### Prerequisites

- Node.js 18 or higher
- pnpm package manager
- PostgreSQL database

### Installation

1. Clone the repository:

```bash
git clone <repository-url>
cd <project-name>
```

2. Install dependencies:

```bash
pnpm install
```

3. Configure environment variables:

```env
# apps/web/.env
NEXT_PUBLIC_BACKEND_URL=http://localhost:3001
NEXT_PUBLIC_WS_URL=http://localhost:3002

# apps/http-backend/.env
NODE_ENV='development'

# packages/db
cp .env .env.example

# packages/common
cp .env .env.example



```

4. Set up the database:

```bash
cd packages/db
npx prisma migrate deploy # FOR migrating tables to DATABASE
npx prisma generate
```

5. Start development servers:

```bash
pnpm dev
```

## Project Structure

```
apps/
  ├── web/                 # Next.js frontend
  ├── http-backend/       # REST API server
  └── ws-backend/        # WebSocket server
packages/
  ├── db/              # Database client
  └── common/          # Shared utilities
  
```

## Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/new-tool`)
3. Commit changes (`git commit -m 'Add new drawing tool'`)
4. Push to branch (`git push origin feature/new-tool`)
5. Open a Pull Request


