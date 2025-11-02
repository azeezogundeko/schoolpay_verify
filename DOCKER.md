# Docker Deployment Guide

This guide explains how to run SchoolPay Verify using Docker and Docker Compose.

## Prerequisites

- Docker Engine 20.10 or higher
- Docker Compose 2.0 or higher
- At least 2GB of available RAM
- Ports 80 and 3001 available on your host machine

## Quick Start

### 1. Clone the Repository

```bash
git clone <repository-url>
cd schoolpay_verify
```

### 2. Configure Environment Variables

Copy the example environment file and fill in your credentials:

```bash
cp .env.example .env
```

Edit `.env` with your actual values:

```env
# Supabase Configuration
SUPABASE_URL=https://your-project.supabase.co
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key

# JWT Configuration
JWT_SECRET=your-super-secret-jwt-key-change-this-in-production

# AI Services (Gemini)
GEMINI_API_KEY=your-gemini-api-key
```

### 3. Build and Start Services

```bash
# Build and start all services in detached mode
docker-compose up -d

# View logs
docker-compose logs -f

# View logs for specific service
docker-compose logs -f backend
docker-compose logs -f frontend
```

### 4. Access the Application

- **Frontend**: http://localhost
- **Backend API**: http://localhost:3001
- **Health Check**: http://localhost:3001/health

### 5. Initialize the Database

```bash
# Run database initialization script
docker-compose exec backend npm run init-db
```

## Docker Compose Services

### Backend Service

- **Container Name**: `schoolpay-backend`
- **Port**: 3001
- **Health Check**: Enabled (checks `/health` endpoint every 30s)
- **Volumes**: Persistent storage for uploaded receipts
- **Auto-restart**: Unless manually stopped

### Frontend Service

- **Container Name**: `schoolpay-frontend`
- **Port**: 80
- **Server**: Nginx
- **Depends on**: Backend service
- **Auto-restart**: Unless manually stopped

## Common Commands

### Start Services

```bash
# Start all services
docker-compose up -d

# Start specific service
docker-compose up -d backend
```

### Stop Services

```bash
# Stop all services
docker-compose down

# Stop and remove volumes
docker-compose down -v
```

### Restart Services

```bash
# Restart all services
docker-compose restart

# Restart specific service
docker-compose restart backend
```

### View Logs

```bash
# All services
docker-compose logs -f

# Backend only
docker-compose logs -f backend

# Last 100 lines
docker-compose logs --tail=100
```

### Execute Commands in Container

```bash
# Open shell in backend container
docker-compose exec backend sh

# Run npm commands
docker-compose exec backend npm install
docker-compose exec backend npm run init-db
```

### Check Service Status

```bash
# View running containers
docker-compose ps

# Check health status
docker-compose ps backend
```

### Rebuild Services

```bash
# Rebuild all images
docker-compose build

# Rebuild specific service
docker-compose build backend

# Rebuild and start
docker-compose up -d --build
```

## Volume Management

### Uploaded Files

Receipt uploads are stored in a Docker volume to persist across container restarts:

```bash
# List volumes
docker volume ls

# Inspect backend uploads volume
docker volume inspect schoolpay_verify_backend-uploads

# Backup uploads (example)
docker run --rm -v schoolpay_verify_backend-uploads:/data -v $(pwd):/backup \
  alpine tar czf /backup/uploads-backup.tar.gz -C /data .

# Restore uploads (example)
docker run --rm -v schoolpay_verify_backend-uploads:/data -v $(pwd):/backup \
  alpine tar xzf /backup/uploads-backup.tar.gz -C /data
```

## Network Configuration

Both services run on a custom bridge network (`schoolpay-network`), allowing them to communicate using service names:

- Backend accessible at: `http://backend:3001`
- Frontend accessible at: `http://frontend:80`

## Production Deployment

### Security Considerations

1. **Change Default Secrets**:
   - Generate strong JWT secret: `openssl rand -base64 64`
   - Use different secrets per environment

2. **Use HTTPS**:
   - Set up reverse proxy (nginx, Traefik, Caddy)
   - Obtain SSL certificates (Let's Encrypt)

3. **Limit Exposed Ports**:
   - Only expose necessary ports
   - Use firewall rules

4. **Environment Variables**:
   - Never commit `.env` file
   - Use secrets management (Docker Secrets, HashiCorp Vault)

### Reverse Proxy Example (Nginx)

```nginx
server {
    listen 443 ssl http2;
    server_name yourdomain.com;

    ssl_certificate /path/to/cert.pem;
    ssl_certificate_key /path/to/key.pem;

    location / {
        proxy_pass http://localhost:80;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
    }

    location /api {
        proxy_pass http://localhost:3001;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
    }
}
```

### Production docker-compose Override

Create `docker-compose.prod.yml`:

```yaml
version: '3.8'

services:
  backend:
    restart: always
    environment:
      - NODE_ENV=production
    logging:
      driver: "json-file"
      options:
        max-size: "10m"
        max-file: "3"

  frontend:
    restart: always
    logging:
      driver: "json-file"
      options:
        max-size: "10m"
        max-file: "3"
```

Run with:

```bash
docker-compose -f docker-compose.yml -f docker-compose.prod.yml up -d
```

## Troubleshooting

### Port Already in Use

```bash
# Check what's using port 80
sudo lsof -i :80

# Check what's using port 3001
sudo lsof -i :3001

# Change ports in docker-compose.yml if needed
```

### Container Won't Start

```bash
# Check logs for errors
docker-compose logs backend
docker-compose logs frontend

# Verify environment variables
docker-compose config

# Check container status
docker-compose ps
```

### Database Connection Issues

```bash
# Verify Supabase credentials in .env
cat .env

# Test connection from backend container
docker-compose exec backend node -e "require('./src/config/database').db"
```

### File Upload Issues

```bash
# Check uploads volume
docker volume inspect schoolpay_verify_backend-uploads

# Verify permissions
docker-compose exec backend ls -la /app/uploads

# Create directory if missing
docker-compose exec backend mkdir -p /app/uploads
```

### Build Failures

```bash
# Clear Docker cache and rebuild
docker-compose build --no-cache

# Remove old images
docker image prune -a

# Check disk space
df -h
```

## Performance Optimization

### Resource Limits

Add to `docker-compose.yml`:

```yaml
services:
  backend:
    deploy:
      resources:
        limits:
          cpus: '1'
          memory: 512M
        reservations:
          cpus: '0.5'
          memory: 256M
```

### Health Check Tuning

Adjust health check intervals based on your needs:

```yaml
healthcheck:
  interval: 60s      # Check every minute
  timeout: 10s       # Wait 10 seconds for response
  retries: 3         # Retry 3 times before marking unhealthy
  start_period: 60s  # Grace period for startup
```

## Monitoring

### Container Stats

```bash
# Real-time resource usage
docker stats

# Specific containers only
docker stats schoolpay-backend schoolpay-frontend
```

### Log Management

```bash
# Export logs
docker-compose logs > application.log

# Clear logs (requires container restart)
truncate -s 0 $(docker inspect --format='{{.LogPath}}' schoolpay-backend)
```

## Cleanup

```bash
# Stop and remove containers, networks
docker-compose down

# Remove volumes as well
docker-compose down -v

# Remove images
docker-compose down --rmi all

# Full cleanup
docker system prune -a --volumes
```

## Development vs Production

### Development Setup

```bash
# Use development compose file
docker-compose -f docker-compose.dev.yml up
```

### Production Setup

```bash
# Use production overrides
docker-compose -f docker-compose.yml -f docker-compose.prod.yml up -d
```

## Support

For issues related to:
- Docker configuration: Check this guide
- Application errors: See `/backend/README.md`
- API documentation: See `/backend/README.md`
- Frontend issues: See main `README.md`
