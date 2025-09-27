# 🚀 HƯỚNG DẪN TRIỂN KHAI CHI TIẾT - ARENAAXIS APP

## 📋 MỤC LỤC
1. [Chuẩn bị Database và Backend API](#1-chuẩn-bị-database-và-backend-api)
2. [Thay thế Mock Data bằng Real API](#2-thay-thế-mock-data-bằng-real-api)
3. [Cập nhật Components có dữ liệu cứng](#3-cập-nhật-components-có-dữ-liệu-cứng)
4. [Testing và Debug](#4-testing-và-debug)
5. [Production Deployment](#5-production-deployment)
6. [Monitoring và Maintenance](#6-monitoring-và-maintenance)

---

## 1. CHUẨN BỊ DATABASE VÀ BACKEND API

### 1.1 Thiết lập Database

#### A. PostgreSQL Setup
```bash
# Cài đặt PostgreSQL
# Ubuntu/Debian:
sudo apt-get install postgresql postgresql-contrib

# macOS:
brew install postgresql

# Windows: Download từ https://www.postgresql.org/download/
```

#### B. Tạo Database
```sql
-- Kết nối PostgreSQL
psql -U postgres

-- Tạo database
CREATE DATABASE arenaaxis_app;
CREATE USER arenaaxis_user WITH PASSWORD 'your_secure_password';
GRANT ALL PRIVILEGES ON DATABASE arenaaxis_app TO arenaaxis_user;

-- Sử dụng database
\c arenaaxis_app arenaaxis_user
```

#### C. Import Schema
```bash
# Chạy schema đã có sẵn
psql -U arenaaxis_user -d arenaaxis_app -f database/schema.sql
```

#### D. Seed Initial Data
```sql
-- Thêm dữ liệu ban đầu
INSERT INTO sports (id, name, icon, image, description, field_count) VALUES
('1', 'Bóng đá', '⚽', '/football-soccer-ball.png', 'Môn thể thao vua phổ biến nhất thế giới', 25),
('2', 'Bóng rổ', '🏀', '/outdoor-basketball-court.png', 'Môn thể thao đồng đội năng động', 12),
('3', 'Tennis', '🎾', '/outdoor-tennis-court.png', 'Môn thể thao cá nhân đẳng cấp', 8),
('4', 'Cầu lông', '🏸', '/badminton-court.png', 'Môn thể thao trong nhà phổ biến', 15),
('5', 'Golf', '⛳', '/lush-golf-course.png', 'Môn thể thao cao cấp và thư giãn', 3);

-- Thêm user mặc định
INSERT INTO users (id, name, email, phone, bio, location, favorite_sports, notifications, stats) VALUES
('user1', 'Nguyễn Văn An', 'nguyenvanan@email.com', '0123456789', 
 'Yêu thích các môn thể thao, đặc biệt là bóng đá và tennis', 'Quận 1, TP.HCM',
 ARRAY['Bóng đá', 'Tennis', 'Cầu lông'],
 '{"booking": true, "tournament": false, "community": true, "email": true, "push": false}',
 '{"totalBookings": 25, "totalTournaments": 3, "totalPosts": 8}');

-- Thêm configurations
CREATE TABLE IF NOT EXISTS configurations (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    key VARCHAR(255) UNIQUE NOT NULL,
    value JSONB NOT NULL,
    created_at TIMESTAMP DEFAULT NOW()
);

INSERT INTO configurations (key, value) VALUES
('skill_levels', '["Mới bắt đầu", "Nghiệp dư", "Trung cấp", "Cao cấp", "Chuyên nghiệp"]'),
('distance_ranges', '["< 1km", "1-5km", "5-10km", "> 10km"]'),
('booking_locations', '["Sân tennis Saigon, Quận 1", "Sân bóng Thể Công, Quận 5", "Sân cầu lông Sunrise, Quận 7"]');
```

### 1.2 Tạo Backend API (Node.js/Express)

#### A. Khởi tạo Backend Project
```bash
# Tạo thư mục backend
mkdir arenaaxis-backend
cd arenaaxis-backend

# Khởi tạo package.json
npm init -y

# Cài đặt dependencies
npm install express cors helmet morgan compression
npm install pg dotenv bcryptjs jsonwebtoken
npm install @types/node @types/express typescript ts-node nodemon --save-dev

# Cài đặt validation
npm install joi express-validator
```

#### B. Cấu trúc Backend
```
arenaaxis-backend/
├── src/
│   ├── controllers/
│   │   ├── authController.js
│   │   ├── userController.js
│   │   ├── sportsController.js
│   │   ├── fieldsController.js
│   │   ├── tournamentsController.js
│   │   ├── communityController.js
│   │   ├── bookingsController.js
│   │   ├── chatController.js
│   │   └── paymentsController.js
│   ├── middleware/
│   │   ├── auth.js
│   │   ├── validation.js
│   │   └── errorHandler.js
│   ├── models/
│   │   └── database.js
│   ├── routes/
│   │   ├── auth.js
│   │   ├── users.js
│   │   ├── sports.js
│   │   ├── fields.js
│   │   ├── tournaments.js
│   │   ├── community.js
│   │   ├── bookings.js
│   │   ├── chat.js
│   │   └── payments.js
│   ├── utils/
│   │   ├── logger.js
│   │   └── helpers.js
│   └── app.js
├── .env
├── package.json
└── server.js
```

#### C. Tạo Main Server File
```javascript
// server.js
const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const compression = require('compression');
require('dotenv').config();

const app = express();

// Middleware
app.use(helmet());
app.use(cors());
app.use(compression());
app.use(morgan('combined'));
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));

// Routes
app.use('/api/auth', require('./src/routes/auth'));
app.use('/api/users', require('./src/routes/users'));
app.use('/api/sports', require('./src/routes/sports'));
app.use('/api/fields', require('./src/routes/fields'));
app.use('/api/tournaments', require('./src/routes/tournaments'));
app.use('/api/community', require('./src/routes/community'));
app.use('/api/bookings', require('./src/routes/bookings'));
app.use('/api/chat', require('./src/routes/chat'));
app.use('/api/payments', require('./src/routes/payments'));

// Error handling
app.use(require('./src/middleware/errorHandler'));

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
```

#### D. Tạo Database Connection
```javascript
// src/models/database.js
const { Pool } = require('pg');

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: process.env.NODE_ENV === 'production' ? { rejectUnauthorized: false } : false
});

module.exports = {
  query: (text, params) => pool.query(text, params),
  pool
};
```

#### E. Tạo Sports Controller (Ví dụ)
```javascript
// src/controllers/sportsController.js
const db = require('../models/database');

const getSports = async (req, res) => {
  try {
    const result = await db.query('SELECT * FROM sports ORDER BY name');
    res.json(result.rows);
  } catch (error) {
    console.error('Error fetching sports:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

const getSportById = async (req, res) => {
  try {
    const { id } = req.params;
    const result = await db.query('SELECT * FROM sports WHERE id = $1', [id]);
    
    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Sport not found' });
    }
    
    res.json(result.rows[0]);
  } catch (error) {
    console.error('Error fetching sport:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

module.exports = {
  getSports,
  getSportById
};
```

#### F. Tạo Sports Routes
```javascript
// src/routes/sports.js
const express = require('express');
const router = express.Router();
const sportsController = require('../controllers/sportsController');

router.get('/', sportsController.getSports);
router.get('/:id', sportsController.getSportById);

module.exports = router;
```

---

## 2. THAY THẾ MOCK DATA BẰNG REAL API

### 2.1 Cập nhật Environment Variables

#### A. Tạo .env.local cho Development
```env
# .env.local
NEXT_PUBLIC_API_BASE_URL=http://localhost:3001/api
DATABASE_URL=postgresql://arenaaxis_user:your_secure_password@localhost:5432/arenaaxis_app
NEXTAUTH_SECRET=your-super-secret-jwt-key
NEXTAUTH_URL=http://localhost:3000
```

#### B. Cập nhật .env.production
```env
# .env.production
NEXT_PUBLIC_API_BASE_URL=https://api.yourdomain.com/api
DATABASE_URL=postgresql://user:pass@prod-db:5432/arenaaxis_prod
NEXTAUTH_SECRET=production-secret-key
NEXTAUTH_URL=https://yourdomain.com
```

### 2.2 Thay thế services/api.ts

#### A. Backup Current File
```bash
# Backup mock version
cp services/api.ts services/api-mock.ts
```

#### B. Replace với Production Version
```bash
# Copy production API service
cp services/api-production.ts services/api.ts
```

#### C. Hoặc Update từng Function (Chi tiết)

**BEFORE (Mock Data):**
```typescript
// services/api.ts - BEFORE
export async function getPopularFields(): Promise<Field[]> {
    const { popularFields } = await import('@/data/mockData')
    return popularFields
}

export async function getSports(): Promise<Sport[]> {
    const { sports } = await import('@/data/mockData')
    return sports
}

export async function getTournaments(): Promise<Tournament[]> {
    const { tournaments } = await import('@/data/mockData')
    return tournaments
}
```

**AFTER (Real API):**
```typescript
// services/api.ts - AFTER
export async function getPopularFields(): Promise<Field[]> {
    const result = await apiCall<Field[]>('/fields/popular')
    return result.success ? result.data! : []
}

export async function getSports(): Promise<Sport[]> {
    const result = await apiCall<Sport[]>('/sports')
    return result.success ? result.data! : []
}

export async function getTournaments(): Promise<Tournament[]> {
    const result = await apiCall<Tournament[]>('/tournaments')
    return result.success ? result.data! : []
}
```

### 2.3 Cập nhật từng API Function

#### A. Fields API
```typescript
// THAY THẾ TẤT CẢ:
export async function getFields(filters?: { sport?: string, location?: string }): Promise<Field[]> {
    // const { popularFields } = await import('@/data/mockData')
    // return popularFields

    // UNCOMMENT:
    const queryParams = new URLSearchParams(filters as any).toString()
    const result = await apiCall<Field[]>(`/fields?${queryParams}`)
    return result.success ? result.data! : []
}

export async function getFieldById(id: string): Promise<Field | null> {
    // const { popularFields } = await import('@/data/mockData')
    // return popularFields.find((field: Field) => field.id === id) || null

    // UNCOMMENT:
    const result = await apiCall<Field>(`/fields/${id}`)
    return result.success ? result.data! : null
}
```

#### B. Community API
```typescript
export async function getCommunityPosts(filters?: { sport?: string, distance?: string }): Promise<CommunityPost[]> {
    // const { communityPosts } = await import('@/data/mockData')
    // return communityPosts

    // UNCOMMENT:
    const queryParams = new URLSearchParams(filters as any).toString()
    const result = await apiCall<CommunityPost[]>(`/community/posts?${queryParams}`)
    return result.success ? result.data! : []
}

export async function getCommunityPostById(id: string): Promise<CommunityPost | null> {
    // try {
    //     const post = communityPosts.find(p => p.id === id) || null
    //     return post
    // } catch (error) {
    //     console.error('Error fetching community post:', error)
    //     return null
    // }

    // UNCOMMENT:
    const result = await apiCall<CommunityPost>(`/community/posts/${id}`)
    return result.success ? result.data! : null
}
```

#### C. Bookings API
```typescript
export async function getBookingHistory(status?: string): Promise<Booking[]> {
    // const { bookingHistory } = await import('@/data/mockData')
    // if (status && status !== 'Tất cả') {
    //     return bookingHistory.filter(booking => booking.status === status)
    // }
    // return bookingHistory

    // UNCOMMENT:
    const queryParams = status ? `?status=${status}` : ''
    const result = await apiCall<Booking[]>(`/bookings${queryParams}`)
    return result.success ? result.data! : []
}
```

---

## 3. CẬP NHẬT COMPONENTS CÓ DỮ LIỆU CỨNG

### 3.1 CommunitySearchFilters Component

#### BEFORE:
```typescript
// components/community/CommunitySearchFilters.tsx - BEFORE
const sports = ["Tất cả", "Tennis", "Bóng đá", "Cầu lông", "Bóng rổ"]
const distances = ["Tất cả", "< 1km", "1-5km", "5-10km", "> 10km"]
```

#### AFTER:
```typescript
// components/community/CommunitySearchFilters.tsx - AFTER
import { useState, useEffect } from "react"
import { getSports } from "@/services/api"
import { Sport } from "@/types"

export default function CommunitySearchFilters({ ... }) {
    const [sports, setSports] = useState<string[]>(["Tất cả"])
    const [distances] = useState(["Tất cả", "< 1km", "1-5km", "5-10km", "> 10km"])
    
    useEffect(() => {
        async function fetchSports() {
            try {
                const sportsData = await getSports()
                setSports(["Tất cả", ...sportsData.map(sport => sport.name)])
            } catch (error) {
                console.error("Error fetching sports:", error)
                // Fallback to hardcoded data
                setSports(["Tất cả", "Tennis", "Bóng đá", "Cầu lông", "Bóng rổ"])
            }
        }
        
        fetchSports()
    }, [])
    
    // Rest of component...
}
```

### 3.2 Community Create Page

#### BEFORE:
```typescript
// app/community/create/page.tsx - BEFORE
const levels = ["Mới bắt đầu", "Nghiệp dư", "Trung cấp", "Cao cấp", "Chuyên nghiệp"]
const bookingHistory = ["Sân tennis Saigon, Quận 1", "Sân bóng Thể Công, Quận 5", "Sân cầu lông Sunrise, Quận 7"]
```

#### AFTER:
```typescript
// app/community/create/page.tsx - AFTER
const [levels, setLevels] = useState<string[]>([])
const [bookingLocations, setBookingLocations] = useState<string[]>([])

useEffect(() => {
    async function fetchConfigurations() {
        try {
            // Tạo API endpoint mới cho configurations
            const [levelsData, locationsData] = await Promise.all([
                apiCall<string[]>('/config/skill-levels'),
                apiCall<string[]>('/config/booking-locations')
            ])
            
            setLevels(levelsData.success ? levelsData.data! : [
                "Mới bắt đầu", "Nghiệp dư", "Trung cấp", "Cao cấp", "Chuyên nghiệp"
            ])
            
            setBookingLocations(locationsData.success ? locationsData.data! : [
                "Sân tennis Saigon, Quận 1", "Sân bóng Thể Công, Quận 5"
            ])
        } catch (error) {
            console.error("Error fetching configurations:", error)
            // Fallback data
            setLevels(["Mới bắt đầu", "Nghiệp dư", "Trung cấp", "Cao cấp", "Chuyên nghiệp"])
            setBookingLocations(["Sân tennis Saigon, Quận 1", "Sân bóng Thể Công, Quận 5"])
        }
    }
    
    fetchConfigurations()
}, [])
```

### 3.3 Community Post Detail Page

#### A. Tạo Enhanced API cho Post Details
```typescript
// services/api.ts - Thêm functions mới
export async function getCommunityPostDetails(id: string): Promise<any> {
    const result = await apiCall<any>(`/community/posts/${id}/details`)
    return result.success ? result.data! : null
}

export async function getCommunityPostMembers(id: string): Promise<any[]> {
    const result = await apiCall<any[]>(`/community/posts/${id}/members`)
    return result.success ? result.data! : []
}

export async function getCommunityPostComments(id: string): Promise<any[]> {
    const result = await apiCall<any[]>(`/community/posts/${id}/comments`)
    return result.success ? result.data! : []
}
```

#### B. Update Component
```typescript
// app/community/[id]/page.tsx - BEFORE
const mockData = {
    date: "20/01/2024",
    time: "18:00 - 20:00",
    participants: "2/4 người",
    // ... lots of mock data
}

// AFTER
const [postDetails, setPostDetails] = useState<any>(null)
const [members, setMembers] = useState<any[]>([])
const [comments, setComments] = useState<any[]>([])
const [loading, setLoading] = useState(true)

useEffect(() => {
    async function fetchPostData() {
        try {
            setLoading(true)
            const [details, memberList, commentList] = await Promise.all([
                getCommunityPostDetails(id),
                getCommunityPostMembers(id),
                getCommunityPostComments(id)
            ])
            
            setPostDetails(details)
            setMembers(memberList)
            setComments(commentList)
        } catch (error) {
            console.error("Error fetching post data:", error)
        } finally {
            setLoading(false)
        }
    }
    
    fetchPostData()
}, [id])

// Sử dụng postDetails thay vì mockData trong JSX
```

### 3.4 Booking Page

#### BEFORE:
```typescript
// app/booking/[id]/page.tsx - BEFORE
const bookingData = {
    "court1": {
        "08:00": "available",
        "09:00": "booked",
        // ... hardcoded slots
    }
}
```

#### AFTER:
```typescript
// app/booking/[id]/page.tsx - AFTER
const [bookingSlots, setBookingSlots] = useState<any>({})
const [loading, setLoading] = useState(true)

useEffect(() => {
    async function fetchBookingSlots() {
        try {
            setLoading(true)
            const result = await apiCall<any>(`/fields/${id}/booking-slots?date=${selectedDate}`)
            
            if (result.success) {
                setBookingSlots(result.data!)
            }
        } catch (error) {
            console.error("Error fetching booking slots:", error)
        } finally {
            setLoading(false)
        }
    }
    
    fetchBookingSlots()
}, [id, selectedDate])
```

---

## 4. TESTING VÀ DEBUG

### 4.1 Development Testing

#### A. Start Backend Server
```bash
cd arenaaxis-backend
npm run dev # hoặc node server.js
```

#### B. Start Frontend
```bash
cd arenaaxis-app
npm run dev
```

#### C. Test API Endpoints
```bash
# Test sports endpoint
curl http://localhost:3001/api/sports

# Test fields endpoint
curl http://localhost:3001/api/fields/popular

# Test with parameters
curl "http://localhost:3001/api/community/posts?sport=Tennis"
```

### 4.2 Debug Common Issues

#### A. CORS Errors
```javascript
// backend/server.js
app.use(cors({
    origin: ['http://localhost:3000', 'https://yourdomain.com'],
    credentials: true
}))
```

#### B. Environment Variables
```typescript
// Kiểm tra trong browser console
console.log('API URL:', process.env.NEXT_PUBLIC_API_BASE_URL)
```

#### C. Network Errors
```typescript
// services/api.ts - Thêm debug logging
console.log('Making API call to:', `${API_BASE_URL}${endpoint}`)
console.log('Response:', data)
```

### 4.3 Error Handling

#### A. Fallback Data
```typescript
// Luôn có fallback cho mọi API call
export async function getSports(): Promise<Sport[]> {
    try {
        const result = await apiCall<Sport[]>('/sports')
        return result.success ? result.data! : []
    } catch (error) {
        console.error('Failed to fetch sports, using fallback:', error)
        // Return fallback data
        return [
            { id: "1", name: "Bóng đá", icon: "⚽", description: "Football" },
            { id: "2", name: "Tennis", icon: "🎾", description: "Tennis" }
        ]
    }
}
```

#### B. Loading States
```typescript
// Thêm loading states cho tất cả components
const [data, setData] = useState([])
const [loading, setLoading] = useState(true)
const [error, setError] = useState<string | null>(null)

useEffect(() => {
    async function fetchData() {
        try {
            setLoading(true)
            setError(null)
            const result = await apiCall()
            setData(result)
        } catch (err) {
            setError(err.message)
        } finally {
            setLoading(false)
        }
    }
    
    fetchData()
}, [])
```

---

## 5. PRODUCTION DEPLOYMENT

### 5.1 Frontend Deployment (Vercel)

#### A. Prepare for Deployment
```bash
# Build và test locally
npm run build
npm start
```

#### B. Deploy to Vercel
```bash
# Install Vercel CLI
npm i -g vercel

# Login
vercel login

# Deploy
vercel --prod
```

#### C. Set Environment Variables
```bash
# Trong Vercel Dashboard hoặc CLI
vercel env add NEXT_PUBLIC_API_BASE_URL production
vercel env add NEXTAUTH_SECRET production
vercel env add NEXTAUTH_URL production
```

### 5.2 Backend Deployment

#### A. Docker Deployment
```dockerfile
# Dockerfile cho backend
FROM node:18-alpine

WORKDIR /app
COPY package*.json ./
RUN npm ci --only=production

COPY . .
EXPOSE 3001

CMD ["node", "server.js"]
```

#### B. Docker Compose
```yaml
# docker-compose.yml
version: '3.8'
services:
  backend:
    build: ./arenaaxis-backend
    ports:
      - "3001:3001"
    environment:
      - DATABASE_URL=postgresql://user:pass@db:5432/arenaaxis
      - NODE_ENV=production
    depends_on:
      - db
      
  db:
    image: postgres:15
    environment:
      - POSTGRES_DB=arenaaxis
      - POSTGRES_USER=user
      - POSTGRES_PASSWORD=pass
    volumes:
      - postgres_data:/var/lib/postgresql/data
      
volumes:
  postgres_data:
```

### 5.3 Database Migration to Production

#### A. Backup Development Data
```bash
pg_dump -U arenaaxis_user arenaaxis_app > backup.sql
```

#### B. Deploy to Production Database
```bash
# Upload schema
psql -U prod_user -d prod_db -f database/schema.sql

# Upload initial data
psql -U prod_user -d prod_db -f database/seed.sql
```

---

## 6. MONITORING VÀ MAINTENANCE

### 6.1 Logging

#### A. Backend Logging
```javascript
// utils/logger.js
const winston = require('winston');

const logger = winston.createLogger({
  level: 'info',
  format: winston.format.json(),
  transports: [
    new winston.transports.File({ filename: 'error.log', level: 'error' }),
    new winston.transports.File({ filename: 'combined.log' }),
  ],
});

if (process.env.NODE_ENV !== 'production') {
  logger.add(new winston.transports.Console({
    format: winston.format.simple()
  }));
}

module.exports = logger;
```

#### B. Frontend Error Tracking
```typescript
// utils/errorTracking.ts
export const logError = (error: Error, context?: any) => {
    console.error('Application Error:', error, context)
    
    // Send to monitoring service
    if (process.env.NODE_ENV === 'production') {
        // Sentry, LogRocket, etc.
        // Sentry.captureException(error, { extra: context })
    }
}
```

### 6.2 Performance Monitoring

#### A. API Response Times
```javascript
// middleware/monitoring.js
const responseTime = require('response-time');

app.use(responseTime((req, res, time) => {
    logger.info(`${req.method} ${req.url} - ${time}ms`);
}));
```

#### B. Database Query Monitoring
```javascript
// Monitor slow queries
const originalQuery = db.query;
db.query = function(text, params) {
    const start = Date.now();
    return originalQuery.call(this, text, params).then(result => {
        const duration = Date.now() - start;
        if (duration > 1000) { // Log queries > 1 second
            logger.warn(`Slow query: ${text} - ${duration}ms`);
        }
        return result;
    });
};
```

### 6.3 Health Checks

#### A. Backend Health Endpoint
```javascript
// routes/health.js
app.get('/health', async (req, res) => {
    try {
        // Check database connection
        await db.query('SELECT 1');
        
        res.json({
            status: 'healthy',
            timestamp: new Date().toISOString(),
            uptime: process.uptime()
        });
    } catch (error) {
        res.status(500).json({
            status: 'unhealthy',
            error: error.message
        });
    }
});
```

---

## 🎯 CHECKLIST TRIỂN KHAI

### Pre-Deployment
- [ ] Database schema created và seeded
- [ ] Backend API endpoints tested
- [ ] Environment variables configured
- [ ] All mock data replaced with real API calls
- [ ] Error handling implemented
- [ ] Loading states added

### Deployment
- [ ] Backend deployed và running
- [ ] Database migrated to production
- [ ] Frontend deployed
- [ ] DNS configured
- [ ] SSL certificate installed

### Post-Deployment
- [ ] Health checks passing
- [ ] Performance monitoring active
- [ ] Error tracking configured
- [ ] Backup strategy implemented
- [ ] Documentation updated

---

## 🚨 TROUBLESHOOTING

### Common Issues:

1. **API không kết nối được**
   - Kiểm tra CORS settings
   - Verify environment variables
   - Check network connectivity

2. **Database connection errors**
   - Verify credentials
   - Check firewall settings
   - Test connection string

3. **Frontend không load data**
   - Check browser console for errors
   - Verify API endpoints
   - Test with curl/Postman

4. **Performance issues**
   - Add database indexes
   - Implement caching
   - Optimize queries

Với hướng dẫn này, bạn có thể triển khai từ mock data sang production một cách có hệ thống và an toàn! 🚀
