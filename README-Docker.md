# Docker Containerization for ROS Project

This document provides instructions for containerizing and running the ROS Project Stencil.js application using Docker.

## Prerequisites

- Docker installed on your system
- Docker Compose (optional, for easier management)

## Project Structure

The application is containerized using a multi-stage Docker build:

- **Development Stage**: For local development with hot reloading
- **Builder Stage**: Compiles the Stencil.js application
- **Production Stage**: Serves the built application using Nginx

## Quick Start

### Production Deployment

1. **Build and run the production container:**
   ```bash
   docker-compose up app
   ```
   
   Or using Docker directly:
   ```bash
   docker build -t ros-project .
   docker run -p 80:80 ros-project
   ```

2. **Access the application:**
   - Open your browser and navigate to `http://localhost`

### Development Mode

1. **Run the development container:**
   ```bash
   docker-compose --profile dev up app-dev
   ```
   
   Or using Docker directly:
   ```bash
   docker build --target development -t ros-project-dev .
   docker run -p 3333:3333 -v $(pwd):/app -v /app/node_modules ros-project-dev
   ```

2. **Access the development server:**
   - Open your browser and navigate to `http://localhost:3333`

## Docker Commands

### Building Images

```bash
# Build production image
docker build -t ros-project:latest .

# Build development image
docker build --target development -t ros-project:dev .

# Build builder image (for CI/CD)
docker build --target builder -t ros-project:builder .
```

### Running Containers

```bash
# Production (port 80)
docker run -d -p 80:80 --name ros-app ros-project:latest

# Production (custom port)
docker run -d -p 8080:80 --name ros-app ros-project:latest

# Development with volume mounting
docker run -d -p 3333:3333 -v $(pwd):/app -v /app/node_modules --name ros-app-dev ros-project:dev
```

### Container Management

```bash
# View running containers
docker ps

# View logs
docker logs ros-app

# Stop container
docker stop ros-app

# Remove container
docker rm ros-app

# Remove image
docker rmi ros-project:latest
```

## Docker Compose Usage

### Available Profiles

- **Default**: Production deployment on port 80
- **prod**: Production deployment on port 8080
- **dev**: Development mode on port 3333

### Commands

```bash
# Production (port 80)
docker-compose up

# Production (port 8080)
docker-compose --profile prod up

# Development
docker-compose --profile dev up

# Run in background
docker-compose up -d

# Stop services
docker-compose down

# Rebuild and start
docker-compose up --build
```

## Configuration

### Environment Variables

- `NODE_ENV`: Set to `production` or `development`

### Nginx Configuration

The production image uses a custom Nginx configuration (`nginx.conf`) that includes:

- Gzip compression for better performance
- Proper MIME types for Stencil.js assets
- Security headers
- SPA routing support
- Health check endpoint at `/health`

### Health Checks

The production container includes a health check endpoint:
- **URL**: `http://localhost/health`
- **Response**: `healthy` (200 OK)

Test the health check:
```bash
curl http://localhost/health
```

## Optimization Features

### Multi-stage Build Benefits

1. **Smaller Production Image**: Only includes built files and Nginx
2. **Security**: No source code or development dependencies in production
3. **Performance**: Optimized Nginx configuration for serving static files

### Caching Strategy

- **Build Cache**: Docker layer caching for faster builds
- **Browser Cache**: Long-term caching for static assets (1 year)
- **Gzip Compression**: Reduced bandwidth usage

## Deployment Options

### Local Development
```bash
docker-compose --profile dev up
```

### Production Testing
```bash
docker-compose --profile prod up
```

### Cloud Deployment
```bash
# Build for your target platform
docker buildx build --platform linux/amd64 -t ros-project:latest .

# Push to registry (replace with your registry)
docker tag ros-project:latest your-registry/ros-project:latest
docker push your-registry/ros-project:latest
```

## Troubleshooting

### Common Issues

1. **Port already in use:**
   ```bash
   # Check what's using the port
   lsof -i :80
   
   # Use a different port
   docker run -p 8080:80 ros-project:latest
   ```

2. **Build failures:**
   ```bash
   # Clean build (no cache)
   docker build --no-cache -t ros-project:latest .
   
   # Check Docker disk space
   docker system df
   docker system prune
   ```

3. **Development hot reload not working:**
   - Ensure volume mounting is correct
   - Check that port 3333 is not blocked by firewall

### Logs and Debugging

```bash
# View container logs
docker logs -f ros-app

# Execute commands in running container
docker exec -it ros-app sh

# Debug nginx configuration
docker exec ros-app nginx -t
```

## Security Considerations

- The production image runs as non-root user
- Security headers are configured in Nginx
- No sensitive information is included in the image
- Use `.dockerignore` to exclude unnecessary files

## Performance Tips

1. **Use .dockerignore** to reduce build context
2. **Leverage build cache** by copying package.json first
3. **Multi-stage builds** keep production images lean
4. **Nginx optimization** with gzip and caching headers 