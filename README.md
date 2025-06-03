# EpubAI Frontend

Smart EPUB Reader frontend built with React, TypeScript, and Vite.

## Features

- Upload and read EPUB books
- AI-powered chapter summaries
- Modern, responsive UI with ShadCN components
- Configurable AI models and settings

## Development

### Prerequisites

- Node.js 18 or higher
- npm or yarn

### Setup

1. Install dependencies:
```bash
npm install
```

2. Create environment file:
```bash
cp .env.example .env
```

3. Update the `.env` file with your backend API URL:
```
VITE_API_BASE_URL=http://localhost:3000/api
```

4. Start development server:
```bash
npm run dev
```

The application will be available at `http://localhost:8080`.

## Docker

### Building the Docker Image

```bash
docker build -t epubai-frontend .
```

### Running with Docker

```bash
docker run -d \
  --name epubai-frontend \
  -p 80:80 \
  -e VITE_API_BASE_URL=http://your-backend-api:3000/api \
  epubai-frontend
```

### Environment Variables

- `VITE_API_BASE_URL`: Backend API URL (default: `http://localhost:3000/api`)

### Docker Compose Example

```yaml
version: '3.8'
services:
  frontend:
    build: .
    ports:
      - "80:80"
    environment:
      - VITE_API_BASE_URL=http://backend:3000/api
    depends_on:
      - backend
```

## Production Build

```bash
npm run build
```

The built files will be in the `dist` directory.

## Architecture

- **Framework**: React 18 with TypeScript
- **Build Tool**: Vite
- **UI Components**: ShadCN/UI with Radix UI primitives
- **Styling**: Tailwind CSS
- **State Management**: React hooks and context
- **HTTP Client**: Fetch API
- **Routing**: React Router

## Configuration

The application supports both build-time and runtime configuration:

1. **Build-time**: Set `VITE_API_BASE_URL` environment variable during build
2. **Runtime**: Set `VITE_API_BASE_URL` environment variable when running the Docker container

The runtime configuration takes precedence and allows for flexible deployment without rebuilding the image.
