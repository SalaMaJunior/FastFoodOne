# FastBite Deployment Guide

This guide covers deploying the complete FastBite food delivery platform.

## 🚀 Quick Start

### Prerequisites

- Docker and Docker Compose
- Node.js 18+ (for local development)
- MongoDB (for local development)
- Redis (for local development)

### Local Development

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd FastBite-Complete
   ```

2. **Start all services with Docker**
   ```bash
   cd infrastructure
   docker-compose up -d
   ```

3. **Access the applications**
   - API Gateway: http://localhost:3000
   - API Documentation: http://localhost:3000/docs
   - Restaurant Dashboard: http://localhost:3001

### Manual Setup (Development)

1. **Backend Services**
   ```bash
   cd backend
   npm install
   npm run dev
   ```

2. **Mobile App**
   ```bash
   cd mobile-app/customer-app
   npm install
   npm start
   ```

3. **Restaurant Dashboard**
   ```bash
   cd restaurant-dashboard
   npm install
   npm run dev
   ```

## 🐳 Docker Deployment

### Production Deployment

1. **Environment Configuration**
   ```bash
   # Copy environment files
   cp backend/api-gateway/env.example backend/api-gateway/.env
   cp backend/services/*/env.example backend/services/*/.env
   cp mobile-app/customer-app/.env.example mobile-app/customer-app/.env
   cp restaurant-dashboard/.env.example restaurant-dashboard/.env.local
   ```

2. **Update environment variables**
   - Set production database URLs
   - Configure external service credentials
   - Set secure JWT secrets
   - Configure CORS origins

3. **Build and deploy**
   ```bash
   cd infrastructure
   docker-compose -f docker-compose.prod.yml up -d
   ```

### Docker Services

- **API Gateway**: Port 3000
- **Auth Service**: Port 3001
- **User Service**: Port 3002
- **Restaurant Service**: Port 3003
- **Order Service**: Port 3004
- **Payment Service**: Port 3005
- **Delivery Service**: Port 3006
- **Notification Service**: Port 3007
- **AI Service**: Port 3008
- **Analytics Service**: Port 3009
- **Restaurant Dashboard**: Port 3001
- **MongoDB**: Port 27017
- **Redis**: Port 6379
- **Nginx**: Port 80/443

## ☁️ Cloud Deployment

### AWS Deployment

1. **EC2 Setup**
   ```bash
   # Launch EC2 instance
   # Install Docker and Docker Compose
   sudo yum update -y
   sudo yum install -y docker
   sudo systemctl start docker
   sudo systemctl enable docker
   sudo usermod -a -G docker ec2-user
   ```

2. **RDS Setup**
   - Create MongoDB Atlas cluster
   - Create ElastiCache Redis cluster
   - Update connection strings

3. **Load Balancer**
   - Configure Application Load Balancer
   - Set up SSL certificates
   - Configure health checks

### Google Cloud Platform

1. **GKE Setup**
   ```bash
   # Create GKE cluster
   gcloud container clusters create fastbite-cluster \
     --num-nodes=3 \
     --machine-type=e2-medium \
     --zone=us-central1-a
   ```

2. **Deploy with Kubernetes**
   ```bash
   kubectl apply -f k8s/
   ```

### Azure Deployment

1. **Container Instances**
   ```bash
   # Deploy with Azure Container Instances
   az container create \
     --resource-group fastbite-rg \
     --name fastbite-api \
     --image fastbite/api-gateway:latest \
     --ports 3000
   ```

## 🔧 Configuration

### Environment Variables

#### API Gateway
```env
PORT=3000
NODE_ENV=production
AUTH_SERVICE_URL=http://auth-service:3001
MONGO_URI=mongodb://mongo:27017/fastbite
REDIS_HOST=redis
JWT_SECRET=your-super-secret-jwt-key
```

#### Mobile App
```env
API_BASE_URL=https://api.fastbite.com/api
WEBSOCKET_URL=wss://api.fastbite.com
GOOGLE_MAPS_API_KEY=your-google-maps-api-key
```

#### Restaurant Dashboard
```env
NEXT_PUBLIC_API_URL=https://api.fastbite.com/api
NEXT_PUBLIC_WS_URL=wss://api.fastbite.com
```

### Database Configuration

#### MongoDB
- Enable authentication
- Configure replica sets for production
- Set up regular backups
- Monitor performance

#### Redis
- Configure persistence
- Set up clustering for high availability
- Monitor memory usage

## 📊 Monitoring

### Health Checks

- **API Gateway**: `GET /health`
- **Services**: `GET /health` on each service
- **Database**: MongoDB and Redis health checks

### Logging

- Centralized logging with ELK stack
- Application logs in JSON format
- Error tracking with Sentry
- Performance monitoring with New Relic

### Metrics

- Prometheus for metrics collection
- Grafana for visualization
- AlertManager for notifications

## 🔒 Security

### SSL/TLS

- Configure SSL certificates
- Enable HTTPS redirect
- Use strong cipher suites
- Implement HSTS

### Authentication

- JWT token validation
- Rate limiting
- CORS configuration
- Input validation

### Data Protection

- Encrypt sensitive data
- Use secure connections
- Implement data retention policies
- Regular security audits

## 🚀 CI/CD Pipeline

### GitHub Actions

```yaml
name: Deploy
on:
  push:
    branches: [main]
jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v2
      - name: Deploy to production
        run: |
          docker-compose -f docker-compose.prod.yml up -d
```

### Automated Testing

- Unit tests for all services
- Integration tests for APIs
- End-to-end tests for mobile app
- Performance tests

## 📱 Mobile App Deployment

### Android

1. **Generate signed APK**
   ```bash
   cd mobile-app/customer-app
   npx react-native run-android --variant=release
   ```

2. **Upload to Google Play Store**
   - Create app listing
   - Upload APK/AAB
   - Configure store settings
   - Submit for review

### iOS

1. **Build for App Store**
   ```bash
   cd mobile-app/customer-app/ios
   xcodebuild -workspace FastBiteCustomerApp.xcworkspace \
     -scheme FastBiteCustomerApp \
     -configuration Release \
     -destination generic/platform=iOS \
     -archivePath FastBiteCustomerApp.xcarchive archive
   ```

2. **Upload to App Store Connect**
   - Use Xcode or Application Loader
   - Configure app information
   - Submit for review

## 🔄 Updates and Maintenance

### Rolling Updates

```bash
# Update specific service
docker-compose up -d --no-deps service-name

# Update all services
docker-compose pull
docker-compose up -d
```

### Database Migrations

```bash
# Run migrations
npm run migrate

# Rollback if needed
npm run migrate:rollback
```

### Backup Strategy

- Daily MongoDB backups
- Redis data persistence
- Application state backup
- Disaster recovery plan

## 🆘 Troubleshooting

### Common Issues

1. **Service not starting**
   - Check logs: `docker-compose logs service-name`
   - Verify environment variables
   - Check port conflicts

2. **Database connection issues**
   - Verify connection strings
   - Check network connectivity
   - Verify credentials

3. **Mobile app not connecting**
   - Check API URL configuration
   - Verify SSL certificates
   - Check network permissions

### Support

- Check logs in `/logs` directory
- Monitor system resources
- Use health check endpoints
- Contact support team

---

**FastBite** - Complete Food Delivery Platform 🍔

