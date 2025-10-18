# 🚀 HƯỚNG DẪN HOÀN CHỈNH: TỪNG BƯỚC MIGRATE TỪ MOCK DATA SANG PRODUCTION

## 📋 MỤC LỤC
1. [Tổng quan và chuẩn bị](#1-tổng-quan-và-chuẩn-bị)
2. [Setup Database PostgreSQL](#2-setup-database-postgresql)
3. [Tạo Backend API](#3-tạo-backend-api)
4. [Cập nhật Frontend Services](#4-cập-nhật-frontend-services)
5. [Cập nhật Components](#5-cập-nhật-components)
6. [Testing và Debug](#6-testing-và-debug)
7. [Production Deployment](#7-production-deployment)
8. [Monitoring và Maintenance](#8-monitoring-và-maintenance)

---

## 1. TỔNG QUAN VÀ CHUẨN BỊ

### 1.1 Kiến trúc hiện tại (Mock Data)
```
Frontend (Next.js) 
  ↓
services/api.ts (Mock data từ data/mockData.ts)
  ↓
components (Hiển thị data)
  ↓
pages (UI)
```

### 1.2 Kiến trúc Production
```
Frontend (Next.js)
  ↓
services/api.ts (Real API calls)
  ↓
Backend API (Express.js/Node.js/Python/PHP...)
  ↓
Database (PostgreSQL)
```

### 1.3 Danh sách cần chuẩn bị
- [ ] PostgreSQL database
- [ ] Backend framework (Node.js Express khuyến nghị)
- [ ] Hosting cho backend (Railway, Heroku, VPS...)
- [ ] Domain cho API (optional)
- [ ] SSL certificate (cho production)

---

## 2. SETUP DATABASE POSTGRESQL

### 2.1 Cài đặt PostgreSQL

#### Trên Windows:
1. Download PostgreSQL từ https://www.postgresql.org/download/windows/
2. Cài đặt với password cho user `postgres`
3. Mở pgAdmin hoặc command line

#### Trên Mac:
```bash
brew install postgresql
brew services start postgresql
```

#### Trên Linux:
```bash
sudo apt update
sudo apt install postgresql postgresql-contrib
sudo systemctl start postgresql
```

### 2.2 Tạo Database và User

```sql
-- Kết nối PostgreSQL như user postgres
psql -U postgres

-- Tạo database
CREATE DATABASE kickoff_app;

-- Tạo user riêng
CREATE USER kickoff_user WITH PASSWORD 'your_strong_password_here';

-- Cấp quyền
GRANT ALL PRIVILEGES ON DATABASE kickoff_app TO kickoff_user;

-- Kết nối vào database mới
\c kickoff_app

-- Cấp quyền tạo table
GRANT CREATE ON SCHEMA public TO kickoff_user;
```

### 2.3 Tạo Database Schema

Tạo file `database/schema.sql`:

```sql
-- Sports table
CREATE TABLE sports (
    id SERIAL PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    description TEXT,
    icon_url VARCHAR(255),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Fields table
CREATE TABLE fields (
    id SERIAL PRIMARY KEY,
    name VARCHAR(200) NOT NULL,
    sport_id INTEGER REFERENCES sports(id),
    location VARCHAR(300) NOT NULL,
    price_per_hour INTEGER NOT NULL,
    description TEXT,
    image_url VARCHAR(255),
    amenities TEXT[], -- Array of amenities
    available_hours TEXT[], -- Array of time slots
    rating DECIMAL(2,1) DEFAULT 0,
    is_popular BOOLEAN DEFAULT false,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Users table
CREATE TABLE users (
    id SERIAL PRIMARY KEY,
    email VARCHAR(255) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    name VARCHAR(200) NOT NULL,
    phone VARCHAR(20),
    avatar_url VARCHAR(255),
    favorite_sports INTEGER[],
    notification_preferences JSONB DEFAULT '{"email": true, "push": true, "sms": false}',
    stats JSONB DEFAULT '{"matches_played": 0, "tournaments_won": 0, "rating": 0}',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Tournaments table
CREATE TABLE tournaments (
    id SERIAL PRIMARY KEY,
    name VARCHAR(200) NOT NULL,
    sport_id INTEGER REFERENCES sports(id),
    description TEXT,
    start_date DATE NOT NULL,
    end_date DATE NOT NULL,
    registration_fee INTEGER NOT NULL,
    max_participants INTEGER NOT NULL,
    image_url VARCHAR(255),
    rules TEXT[],
    prizes TEXT[],
    status VARCHAR(20) DEFAULT 'upcoming' CHECK (status IN ('upcoming', 'ongoing', 'completed', 'cancelled')),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Bookings table
CREATE TABLE bookings (
    id SERIAL PRIMARY KEY,
    user_id INTEGER REFERENCES users(id),
    field_id INTEGER REFERENCES fields(id),
    date DATE NOT NULL,
    start_time TIME NOT NULL,
    end_time TIME NOT NULL,
    total_price INTEGER NOT NULL,
    status VARCHAR(20) DEFAULT 'pending' CHECK (status IN ('pending', 'confirmed', 'cancelled', 'completed')),
    notes TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Community posts table
CREATE TABLE community_posts (
    id SERIAL PRIMARY KEY,
    author_id INTEGER REFERENCES users(id),
    title VARCHAR(300) NOT NULL,
    content TEXT NOT NULL,
    type VARCHAR(50) NOT NULL CHECK (type IN ('general', 'match_request', 'equipment_sale', 'tournament_announcement')),
    image_url VARCHAR(255),
    tags TEXT[],
    likes INTEGER DEFAULT 0,
    comments_count INTEGER DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Reviews table
CREATE TABLE reviews (
    id SERIAL PRIMARY KEY,
    field_id INTEGER REFERENCES fields(id),
    user_id INTEGER REFERENCES users(id),
    rating INTEGER CHECK (rating >= 1 AND rating <= 5),
    comment TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Chat rooms table
CREATE TABLE chat_rooms (
    id SERIAL PRIMARY KEY,
    name VARCHAR(200) NOT NULL,
    type VARCHAR(20) DEFAULT 'public' CHECK (type IN ('public', 'private')),
    description TEXT,
    participants INTEGER[],
    created_by INTEGER REFERENCES users(id),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Chat messages table
CREATE TABLE chat_messages (
    id SERIAL PRIMARY KEY,
    room_id INTEGER REFERENCES chat_rooms(id),
    sender_id INTEGER REFERENCES users(id),
    message TEXT NOT NULL,
    message_type VARCHAR(20) DEFAULT 'text' CHECK (message_type IN ('text', 'image', 'file')),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Tournament registrations table
CREATE TABLE tournament_registrations (
    id SERIAL PRIMARY KEY,
    tournament_id INTEGER REFERENCES tournaments(id),
    user_id INTEGER REFERENCES users(id),
    registration_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    status VARCHAR(20) DEFAULT 'registered' CHECK (status IN ('registered', 'cancelled', 'waitlist')),
    UNIQUE(tournament_id, user_id)
);

-- Indexes for performance
CREATE INDEX idx_fields_sport_id ON fields(sport_id);
CREATE INDEX idx_fields_is_popular ON fields(is_popular);
CREATE INDEX idx_bookings_user_id ON bookings(user_id);
CREATE INDEX idx_bookings_field_id ON bookings(field_id);
CREATE INDEX idx_bookings_date ON bookings(date);
CREATE INDEX idx_reviews_field_id ON reviews(field_id);
CREATE INDEX idx_community_posts_author_id ON community_posts(author_id);
CREATE INDEX idx_community_posts_type ON community_posts(type);
CREATE INDEX idx_chat_messages_room_id ON chat_messages(room_id);

-- Update triggers for updated_at
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_sports_updated_at BEFORE UPDATE ON sports FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_fields_updated_at BEFORE UPDATE ON fields FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_users_updated_at BEFORE UPDATE ON users FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_tournaments_updated_at BEFORE UPDATE ON tournaments FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_bookings_updated_at BEFORE UPDATE ON bookings FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_community_posts_updated_at BEFORE UPDATE ON community_posts FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_reviews_updated_at BEFORE UPDATE ON reviews FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_chat_rooms_updated_at BEFORE UPDATE ON chat_rooms FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
```

### 2.4 Chạy Schema

```bash
# Chạy schema
psql -U kickoff_user -d kickoff_app -f database/schema.sql
```

### 2.5 Seed Data (Dữ liệu mẫu)

Tạo file `database/seed.sql`:

```sql
-- Insert sports
INSERT INTO sports (name, description, icon_url) VALUES
('Football', 'Môn bóng đá với sân cỏ tự nhiên và nhân tạo', '/football-soccer-ball.png'),
('Basketball', 'Môn bóng rổ trong nhà và ngoài trời', '/placeholder.svg'),
('Tennis', 'Môn tennis đơn và đôi', '/placeholder.svg'),
('Badminton', 'Môn cầu lông trong nhà', '/badminton-court.png'),
('Golf', 'Môn golf với sân 18 lỗ', '/placeholder.svg');

-- Insert fields
INSERT INTO fields (name, sport_id, location, price_per_hour, description, image_url, amenities, available_hours, rating, is_popular) VALUES
('Sân Bóng Đá FPT Arena', 1, 'Quận 9, TP.HCM', 300000, 'Sân bóng đá tiêu chuẩn FIFA với cỏ nhân tạo cao cấp', '/modern-football-turf-field.png', 
 ARRAY['Parking', 'Changing Room', 'Shower'], ARRAY['06:00-22:00'], 4.8, true),
('Sân Tennis Landmark', 3, 'Quận 1, TP.HCM', 200000, 'Sân tennis ngoài trời với ánh sáng đêm', '/outdoor-tennis-court.png',
 ARRAY['Parking', 'Equipment Rental'], ARRAY['06:00-21:00'], 4.6, true),
('Sân Cầu Lông Dream Court', 4, 'Quận 3, TP.HCM', 150000, 'Sân cầu lông trong nhà điều hòa', '/badminton-court.png',
 ARRAY['Air Conditioning', 'Parking'], ARRAY['06:00-23:00'], 4.7, false),
('Sân Bóng Rổ Street Court', 2, 'Quận 7, TP.HCM', 180000, 'Sân bóng rổ ngoài trời phong cách street', '/outdoor-basketball-court.png',
 ARRAY['Lighting', 'Water'], ARRAY['06:00-22:00'], 4.3, false),
('Golf Course Saigon', 5, 'Quận 2, TP.HCM', 800000, 'Sân golf 18 lỗ tiêu chuẩn quốc tế', '/lush-golf-course.png',
 ARRAY['Caddy Service', 'Restaurant', 'Pro Shop'], ARRAY['05:30-18:00'], 4.9, true);

-- Insert sample user (password: "password123")
INSERT INTO users (email, password_hash, name, phone, avatar_url, favorite_sports, stats) VALUES
('admin@kickoff.com', '$2b$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'Admin User', '0901234567', '/placeholder-user.jpg',
 ARRAY[1, 2], '{"matches_played": 45, "tournaments_won": 3, "rating": 4.5}');

-- Insert tournaments
INSERT INTO tournaments (name, sport_id, description, start_date, end_date, registration_fee, max_participants, image_url, rules, prizes, status) VALUES
('Giải Bóng Đá Mùa Hè 2024', 1, 'Giải đấu bóng đá lớn nhất mùa hè', 
 '2024-07-01', '2024-07-15', 500000, 16, '/football-tournament-poster.png',
 ARRAY['11 vs 11', 'Thẻ vàng/đỏ theo luật FIFA'], 
 ARRAY['Cúp vàng', '10 triệu VNĐ', '5 triệu VNĐ'], 'upcoming'),
('Giải Tennis Open', 3, 'Giải tennis đơn nam và nữ', 
 '2024-08-01', '2024-08-05', 300000, 32, '/tennis-tournament-poster.png',
 ARRAY['Single elimination', 'Best of 3 sets'],
 ARRAY['Cúp vàng', '5 triệu VNĐ', '2 triệu VNĐ'], 'upcoming');

-- Insert sample reviews
INSERT INTO reviews (field_id, user_id, rating, comment) VALUES
(1, 1, 5, 'Sân bóng rất đẹp, cỏ nhân tạo chất lượng cao'),
(2, 1, 4, 'Vị trí thuận lợi, tuy nhiên giá hơi cao'),
(3, 1, 5, 'Sân cầu lông tốt, điều hòa mát mẻ');

-- Insert sample community posts
INSERT INTO community_posts (author_id, title, content, type, tags) VALUES
(1, 'Tìm đối thủ đá bóng cuối tuần', 'Nhóm mình cần thêm 2 người để đủ đội. Đá sân FPT Arena chủ nhật này.', 'match_request', ARRAY['football', 'weekend']),
(1, 'Bán giày đá bóng Nike mới 95%', 'Giày Nike Mercurial size 42, mua nhầm size. Giá 1.2tr, còn mới 95%.', 'equipment_sale', ARRAY['football', 'equipment']);

-- Insert sample chat room
INSERT INTO chat_rooms (name, description, participants, created_by) VALUES
('Football Lovers HCM', 'Nhóm chat cho những người yêu bóng đá ở TP.HCM', ARRAY[1], 1);

-- Insert sample chat messages
INSERT INTO chat_messages (room_id, sender_id, message) VALUES
(1, 1, 'Chào mọi người! Nhóm mới thành lập, hãy tham gia thảo luận nhé!'),
(1, 1, 'Ai rảnh đá bóng cuối tuần này không?');
```

### 2.6 Chạy Seed Data

```bash
psql -U kickoff_user -d kickoff_app -f database/seed.sql
```

---

## 3. TẠO BACKEND API

### 3.1 Khởi tạo Backend Project (Node.js Express)

```bash
# Tạo folder backend
mkdir kickoff-backend
cd kickoff-backend

# Khởi tạo npm project
npm init -y

# Cài đặt dependencies
npm install express cors helmet morgan dotenv bcryptjs jsonwebtoken
npm install pg @types/pg  # PostgreSQL driver
npm install express-validator # Validation
npm install multer         # File upload

# Dev dependencies
npm install -D nodemon @types/node @types/express typescript ts-node
```

### 3.2 Setup TypeScript

Tạo `tsconfig.json`:

```json
{
  "compilerOptions": {
    "target": "ES2020",
    "module": "commonjs",
    "lib": ["ES2020"],
    "outDir": "./dist",
    "rootDir": "./src",
    "strict": true,
    "esModuleInterop": true,
    "skipLibCheck": true,
    "forceConsistentCasingInFileNames": true,
    "resolveJsonModule": true
  },
  "include": ["src/**/*"],
  "exclude": ["node_modules", "dist"]
}
```

### 3.3 Cấu hình Environment

Tạo `.env`:

```env
# Server
PORT=3001
NODE_ENV=development

# Database
DATABASE_URL=postgresql://kickoff_user:your_password@localhost:5432/kickoff_app

# JWT
JWT_SECRET=your-super-secret-jwt-key-here
JWT_EXPIRE=7d

# CORS
FRONTEND_URL=http://localhost:3000

# File Upload
UPLOAD_DIR=uploads
MAX_FILE_SIZE=5242880  # 5MB
```

### 3.4 Database Connection

Tạo `src/config/database.ts`:

```typescript
import { Pool } from 'pg'
import dotenv from 'dotenv'

dotenv.config()

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: process.env.NODE_ENV === 'production' ? { rejectUnauthorized: false } : false
})

// Test connection
pool.connect()
  .then(client => {
    console.log('✅ Database connected successfully')
    client.release()
  })
  .catch(err => {
    console.error('❌ Database connection error:', err)
  })

export default pool
```

### 3.5 Main Server File

Tạo `src/server.ts`:

```typescript
import express from 'express'
import cors from 'cors'
import helmet from 'helmet'
import morgan from 'morgan'
import dotenv from 'dotenv'
import path from 'path'

// Import routes
import sportsRoutes from './routes/sports'
import fieldsRoutes from './routes/fields'
import usersRoutes from './routes/users'
import tournamentsRoutes from './routes/tournaments'
import bookingsRoutes from './routes/bookings'
import reviewsRoutes from './routes/reviews'
import communityRoutes from './routes/community'
import authRoutes from './routes/auth'

dotenv.config()

const app = express()
const PORT = process.env.PORT || 3001

// Middleware
app.use(helmet())
app.use(cors({
  origin: process.env.FRONTEND_URL || 'http://localhost:3000',
  credentials: true
}))
app.use(morgan('combined'))
app.use(express.json({ limit: '10mb' }))
app.use(express.urlencoded({ extended: true }))

// Static files (for uploaded images)
app.use('/uploads', express.static(path.join(__dirname, '../uploads')))

// Health check
app.get('/health', (req, res) => {
  res.json({ status: 'OK', timestamp: new Date().toISOString() })
})

// API Routes
app.use('/api/auth', authRoutes)
app.use('/api/sports', sportsRoutes)
app.use('/api/fields', fieldsRoutes)
app.use('/api/users', usersRoutes)
app.use('/api/tournaments', tournamentsRoutes)
app.use('/api/bookings', bookingsRoutes)
app.use('/api/reviews', reviewsRoutes)
app.use('/api/community', communityRoutes)

// Error handling middleware
app.use((err: any, req: express.Request, res: express.Response, next: express.NextFunction) => {
  console.error(err.stack)
  res.status(500).json({ 
    success: false, 
    message: 'Internal Server Error',
    error: process.env.NODE_ENV === 'development' ? err.message : undefined
  })
})

// 404 handler
app.use('*', (req, res) => {
  res.status(404).json({ success: false, message: 'Route not found' })
})

app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`)
  console.log(`📊 Health check: http://localhost:${PORT}/health`)
  console.log(`🔗 API base: http://localhost:${PORT}/api`)
})
```

### 3.6 Sports Routes

Tạo `src/routes/sports.ts`:

```typescript
import { Router } from 'express'
import pool from '../config/database'

const router = Router()

// GET /api/sports - Lấy tất cả sports
router.get('/', async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM sports ORDER BY name')
    
    res.json({
      success: true,
      data: result.rows,
      message: 'Sports retrieved successfully'
    })
  } catch (error) {
    console.error('Error fetching sports:', error)
    res.status(500).json({
      success: false,
      data: null,
      message: 'Failed to fetch sports'
    })
  }
})

// GET /api/sports/:id - Lấy sport theo ID
router.get('/:id', async (req, res) => {
  try {
    const { id } = req.params
    const result = await pool.query('SELECT * FROM sports WHERE id = $1', [id])
    
    if (result.rows.length === 0) {
      return res.status(404).json({
        success: false,
        data: null,
        message: 'Sport not found'
      })
    }
    
    res.json({
      success: true,
      data: result.rows[0],
      message: 'Sport retrieved successfully'
    })
  } catch (error) {
    console.error('Error fetching sport:', error)
    res.status(500).json({
      success: false,
      data: null,
      message: 'Failed to fetch sport'
    })
  }
})

export default router
```

### 3.7 Fields Routes

Tạo `src/routes/fields.ts`:

```typescript
import { Router } from 'express'
import pool from '../config/database'

const router = Router()

// GET /api/fields - Lấy tất cả fields
router.get('/', async (req, res) => {
  try {
    const { sport_id, location, limit = 20, offset = 0 } = req.query
    
    let query = `
      SELECT f.*, s.name as sport_name 
      FROM fields f 
      LEFT JOIN sports s ON f.sport_id = s.id 
      WHERE 1=1
    `
    const params: any[] = []
    let paramCount = 0
    
    if (sport_id) {
      paramCount++
      query += ` AND f.sport_id = $${paramCount}`
      params.push(sport_id)
    }
    
    if (location) {
      paramCount++
      query += ` AND f.location ILIKE $${paramCount}`
      params.push(`%${location}%`)
    }
    
    query += ` ORDER BY f.rating DESC, f.name`
    
    paramCount++
    query += ` LIMIT $${paramCount}`
    params.push(limit)
    
    paramCount++
    query += ` OFFSET $${paramCount}`
    params.push(offset)
    
    const result = await pool.query(query, params)
    
    res.json({
      success: true,
      data: result.rows,
      message: 'Fields retrieved successfully'
    })
  } catch (error) {
    console.error('Error fetching fields:', error)
    res.status(500).json({
      success: false,
      data: null,
      message: 'Failed to fetch fields'
    })
  }
})

// GET /api/fields/popular - Lấy fields popular
router.get('/popular', async (req, res) => {
  try {
    const result = await pool.query(`
      SELECT f.*, s.name as sport_name 
      FROM fields f 
      LEFT JOIN sports s ON f.sport_id = s.id 
      WHERE f.is_popular = true 
      ORDER BY f.rating DESC 
      LIMIT 10
    `)
    
    res.json({
      success: true,
      data: result.rows,
      message: 'Popular fields retrieved successfully'
    })
  } catch (error) {
    console.error('Error fetching popular fields:', error)
    res.status(500).json({
      success: false,
      data: null,
      message: 'Failed to fetch popular fields'
    })
  }
})

// GET /api/fields/:id - Lấy field theo ID
router.get('/:id', async (req, res) => {
  try {
    const { id } = req.params
    const result = await pool.query(`
      SELECT f.*, s.name as sport_name 
      FROM fields f 
      LEFT JOIN sports s ON f.sport_id = s.id 
      WHERE f.id = $1
    `, [id])
    
    if (result.rows.length === 0) {
      return res.status(404).json({
        success: false,
        data: null,
        message: 'Field not found'
      })
    }
    
    res.json({
      success: true,
      data: result.rows[0],
      message: 'Field retrieved successfully'
    })
  } catch (error) {
    console.error('Error fetching field:', error)
    res.status(500).json({
      success: false,
      data: null,
      message: 'Failed to fetch field'
    })
  }
})

export default router
```

### 3.8 Package.json Scripts

Cập nhật `package.json`:

```json
{
  "scripts": {
    "dev": "nodemon src/server.ts",
    "build": "tsc",
    "start": "node dist/server.js",
    "start:dev": "ts-node src/server.ts"
  }
}
```

### 3.9 Chạy Backend

```bash
# Development mode
npm run dev

# Hoặc
npm run start:dev
```

Test API:
```bash
curl http://localhost:3001/api/sports
curl http://localhost:3001/api/fields/popular
```

---

## 4. CẬP NHẬT FRONTEND SERVICES

### 4.1 Backup API hiện tại

```bash
cp services/api.ts services/api-mock-backup.ts
```

### 4.2 Cập nhật Environment Variables

Tạo `.env.local` trong frontend:

```env
NEXT_PUBLIC_API_URL=http://localhost:3001/api
NEXT_PUBLIC_API_MODE=production
```

### 4.3 Cập nhật config/api.ts

```typescript
// Production API Configuration
export const API_CONFIG = {
    BASE_URL: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001/api',
    TIMEOUT: 10000, // 10 seconds
    RETRY_ATTEMPTS: 3,
    
    ENDPOINTS: {
        // Auth endpoints
        AUTH: {
            LOGIN: '/auth/login',
            REGISTER: '/auth/register',
            REFRESH: '/auth/refresh',
            LOGOUT: '/auth/logout',
        },
        
        // Sports endpoints
        SPORTS: {
            LIST: '/sports',
            DETAIL: '/sports',  // /sports/:id
        },
        
        // Fields endpoints
        FIELDS: {
            LIST: '/fields',
            POPULAR: '/fields/popular',
            DETAIL: '/fields', // /fields/:id
        },
        
        // Tournaments endpoints
        TOURNAMENTS: {
            LIST: '/tournaments',
            DETAIL: '/tournaments', // /tournaments/:id
            REGISTER: '/tournaments', // /tournaments/:id/register
        },
        
        // Bookings endpoints
        BOOKINGS: {
            CREATE: '/bookings',
            LIST: '/bookings', // /bookings/user/:userId
            DETAIL: '/bookings', // /bookings/:id
        },
        
        // Reviews endpoints
        REVIEWS: {
            BY_FIELD: '/reviews', // /reviews/:fieldId
            CREATE: '/reviews',
        },
        
        // Community endpoints
        COMMUNITY: {
            LIST: '/community',
            CREATE: '/community',
            DETAIL: '/community', // /community/:id
        },
        
        // Users endpoints
        USERS: {
            PROFILE: '/users', // /users/:id
            UPDATE: '/users', // /users/:id
        }
    }
}

// Auth interceptor for adding authorization headers
export const authInterceptor = (config: RequestInit) => {
    // Get token from localStorage or cookies
    const token = localStorage.getItem('auth_token')
    
    if (token) {
        config.headers = {
            ...config.headers,
            'Authorization': `Bearer ${token}`
        }
    }
    
    return config
}

// Response interceptor for handling common errors
export const responseInterceptor = async (response: Response) => {
    if (response.status === 401) {
        // Unauthorized - redirect to login
        localStorage.removeItem('auth_token')
        window.location.href = '/login'
        return null
    }
    
    if (!response.ok) {
        const errorData = await response.json().catch(() => ({}))
        throw new Error(errorData.message || `HTTP ${response.status}`)
    }
    
    return response.json()
}
```

### 4.4 Cập nhật services/api.ts

Thay thế hoàn toàn nội dung `services/api.ts`:

```typescript
// Production API Service layer
import { API_CONFIG, authInterceptor, responseInterceptor } from '@/config/api'
import { 
    Field, 
    Sport, 
    Tournament, 
    CommunityPost, 
    Booking, 
    ChatRoom, 
    ChatMessage, 
    ApiResponse, 
    Review, 
    User, 
    UpdateUserData 
} from '@/types'

// Utility function for API calls with error handling and retry
async function apiCall<T>(
    endpoint: string, 
    options: RequestInit = {},
    retryCount = 0
): Promise<ApiResponse<T>> {
    try {
        // Apply auth interceptor
        const config = authInterceptor({
            headers: {
                'Content-Type': 'application/json',
                ...options.headers,
            },
            ...options,
        })

        const response = await fetch(`${API_CONFIG.BASE_URL}${endpoint}`, config)
        
        if (!response.ok) {
            throw new Error(`HTTP ${response.status}: ${response.statusText}`)
        }

        const data = await response.json()
        return data // Backend trả về format { success, data, message }

    } catch (error) {
        console.error(`API call failed for ${endpoint}:`, error)
        
        // Retry logic
        if (retryCount < API_CONFIG.RETRY_ATTEMPTS) {
            console.log(`Retrying API call (${retryCount + 1}/${API_CONFIG.RETRY_ATTEMPTS})...`)
            await new Promise(resolve => setTimeout(resolve, 1000 * (retryCount + 1)))
            return apiCall(endpoint, options, retryCount + 1)
        }
        
        return {
            success: false,
            data: null as T,
            message: error instanceof Error ? error.message : 'Unknown error occurred'
        }
    }
}

// ===============================
// SPORTS API FUNCTIONS
// ===============================

export async function getSports(): Promise<ApiResponse<Sport[]>> {
    return apiCall<Sport[]>(API_CONFIG.ENDPOINTS.SPORTS.LIST)
}

export async function getSportById(id: string): Promise<ApiResponse<Sport>> {
    return apiCall<Sport>(`${API_CONFIG.ENDPOINTS.SPORTS.DETAIL}/${id}`)
}

// ===============================
// FIELDS API FUNCTIONS
// ===============================

export async function getPopularFields(): Promise<ApiResponse<Field[]>> {
    return apiCall<Field[]>(API_CONFIG.ENDPOINTS.FIELDS.POPULAR)
}

export async function getAllFields(filters?: {
    sportId?: string
    location?: string
    limit?: number
    offset?: number
}): Promise<ApiResponse<Field[]>> {
    const params = new URLSearchParams()
    
    if (filters?.sportId) params.append('sport_id', filters.sportId)
    if (filters?.location) params.append('location', filters.location)
    if (filters?.limit) params.append('limit', filters.limit.toString())
    if (filters?.offset) params.append('offset', filters.offset.toString())
    
    const queryString = params.toString()
    const endpoint = queryString 
        ? `${API_CONFIG.ENDPOINTS.FIELDS.LIST}?${queryString}`
        : API_CONFIG.ENDPOINTS.FIELDS.LIST
        
    return apiCall<Field[]>(endpoint)
}

export async function getFieldById(id: string): Promise<ApiResponse<Field>> {
    return apiCall<Field>(`${API_CONFIG.ENDPOINTS.FIELDS.DETAIL}/${id}`)
}

// ===============================
// TOURNAMENTS API FUNCTIONS
// ===============================

export async function getTournaments(): Promise<ApiResponse<Tournament[]>> {
    return apiCall<Tournament[]>(API_CONFIG.ENDPOINTS.TOURNAMENTS.LIST)
}

export async function getTournamentById(id: string): Promise<ApiResponse<Tournament>> {
    return apiCall<Tournament>(`${API_CONFIG.ENDPOINTS.TOURNAMENTS.DETAIL}/${id}`)
}

export async function registerForTournament(
    tournamentId: string, 
    userId: string
): Promise<ApiResponse<{ success: boolean }>> {
    return apiCall<{ success: boolean }>(
        `${API_CONFIG.ENDPOINTS.TOURNAMENTS.REGISTER}/${tournamentId}/register`,
        {
            method: 'POST',
            body: JSON.stringify({ userId })
        }
    )
}

// ===============================
// BOOKINGS API FUNCTIONS
// ===============================

export async function createBooking(
    bookingData: Omit<Booking, 'id' | 'status' | 'createdAt'>
): Promise<ApiResponse<Booking>> {
    return apiCall<Booking>(API_CONFIG.ENDPOINTS.BOOKINGS.CREATE, {
        method: 'POST',
        body: JSON.stringify(bookingData)
    })
}

export async function getUserBookings(userId: string): Promise<ApiResponse<Booking[]>> {
    return apiCall<Booking[]>(`${API_CONFIG.ENDPOINTS.BOOKINGS.LIST}/user/${userId}`)
}

export async function getBookingById(id: string): Promise<ApiResponse<Booking>> {
    return apiCall<Booking>(`${API_CONFIG.ENDPOINTS.BOOKINGS.DETAIL}/${id}`)
}

// ===============================
// REVIEWS API FUNCTIONS
// ===============================

export async function getFieldReviews(fieldId: string): Promise<ApiResponse<Review[]>> {
    return apiCall<Review[]>(`${API_CONFIG.ENDPOINTS.REVIEWS.BY_FIELD}/${fieldId}`)
}

export async function createReview(
    reviewData: Omit<Review, 'id' | 'createdAt'>
): Promise<ApiResponse<Review>> {
    return apiCall<Review>(API_CONFIG.ENDPOINTS.REVIEWS.CREATE, {
        method: 'POST',
        body: JSON.stringify(reviewData)
    })
}

// ===============================
// COMMUNITY API FUNCTIONS
// ===============================

export async function getCommunityPosts(): Promise<ApiResponse<CommunityPost[]>> {
    return apiCall<CommunityPost[]>(API_CONFIG.ENDPOINTS.COMMUNITY.LIST)
}

export async function createCommunityPost(
    postData: Omit<CommunityPost, 'id' | 'createdAt' | 'likes' | 'commentsCount'>
): Promise<ApiResponse<CommunityPost>> {
    return apiCall<CommunityPost>(API_CONFIG.ENDPOINTS.COMMUNITY.CREATE, {
        method: 'POST',
        body: JSON.stringify(postData)
    })
}

// ===============================
// USERS API FUNCTIONS
// ===============================

export async function getUserById(id: string): Promise<ApiResponse<User>> {
    return apiCall<User>(`${API_CONFIG.ENDPOINTS.USERS.PROFILE}/${id}`)
}

export async function updateUser(
    id: string, 
    userData: UpdateUserData
): Promise<ApiResponse<User>> {
    return apiCall<User>(`${API_CONFIG.ENDPOINTS.USERS.UPDATE}/${id}`, {
        method: 'PUT',
        body: JSON.stringify(userData)
    })
}

// ===============================
// CHAT API FUNCTIONS (Mock for now)
// ===============================

export async function getChatRooms(): Promise<ApiResponse<ChatRoom[]>> {
    // TODO: Implement when chat backend is ready
    return {
        success: true,
        data: [],
        message: 'Chat feature coming soon'
    }
}

export async function getChatMessages(roomId: string): Promise<ApiResponse<ChatMessage[]>> {
    // TODO: Implement when chat backend is ready
    return {
        success: true,
        data: [],
        message: 'Chat feature coming soon'
    }
}

export async function sendChatMessage(
    roomId: string, 
    message: Omit<ChatMessage, 'id' | 'timestamp'>
): Promise<ApiResponse<ChatMessage>> {
    // TODO: Implement when chat backend is ready
    return {
        success: false,
        data: null,
        message: 'Chat feature not implemented yet'
    }
}

// ===============================
// PAYMENT API FUNCTIONS (Mock for now)
// ===============================

interface PaymentData {
    accountNumber: string
    ifscCode: string
    name: string
    expiryDate?: string
    cvv?: string
}

interface PaymentResponse {
    success: boolean
    transactionId?: string
    message: string
}

export async function processPayment(paymentData: PaymentData): Promise<PaymentResponse> {
    // TODO: Implement real payment gateway
    await new Promise(resolve => setTimeout(resolve, 2000)) // Simulate processing
    
    return {
        success: true,
        transactionId: 'TXN' + Math.random().toString(36).substr(2, 9),
        message: 'Payment processed successfully'
    }
}

// ===============================
// AUTH API FUNCTIONS (TODO)
// ===============================

export async function login(email: string, password: string): Promise<ApiResponse<{ user: User, token: string }>> {
    // TODO: Implement when auth backend is ready
    return {
        success: false,
        data: null,
        message: 'Auth not implemented yet'
    }
}

export async function register(userData: {
    email: string
    password: string
    name: string
    phone?: string
}): Promise<ApiResponse<{ user: User, token: string }>> {
    // TODO: Implement when auth backend is ready
    return {
        success: false,
        data: null,
        message: 'Auth not implemented yet'
    }
}
```

---

## 5. CẬP NHẬT COMPONENTS

### 5.1 Thêm Loading States

Cập nhật components để handle loading và error states:

Ví dụ trong `app/page.tsx`:

```typescript
'use client'

import { useState, useEffect } from 'react'
import { Field, Sport } from '@/types'
import { getPopularFields, getSports } from '@/services/api'

// Component imports...

export default function HomePage() {
    const [popularFields, setPopularFields] = useState<Field[]>([])
    const [sports, setSports] = useState<Sport[]>([])
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState<string | null>(null)

    useEffect(() => {
        const fetchData = async () => {
            try {
                setLoading(true)
                setError(null)

                // Parallel API calls
                const [fieldsResponse, sportsResponse] = await Promise.all([
                    getPopularFields(),
                    getSports()
                ])

                if (fieldsResponse.success) {
                    setPopularFields(fieldsResponse.data)
                } else {
                    console.error('Failed to fetch fields:', fieldsResponse.message)
                }

                if (sportsResponse.success) {
                    setSports(sportsResponse.data)
                } else {
                    console.error('Failed to fetch sports:', sportsResponse.message)
                }

            } catch (err) {
                setError('Failed to load data. Please try again.')
                console.error('Data fetch error:', err)
            } finally {
                setLoading(false)
            }
        }

        fetchData()
    }, [])

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-gray-900 mx-auto"></div>
                    <p className="mt-4 text-gray-600">Loading...</p>
                </div>
            </div>
        )
    }

    if (error) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="text-center">
                    <p className="text-red-600 mb-4">{error}</p>
                    <button 
                        onClick={() => window.location.reload()}
                        className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
                    >
                        Retry
                    </button>
                </div>
            </div>
        )
    }

    return (
        <div className="min-h-screen bg-background">
            {/* Rest of your component */}
        </div>
    )
}
```

### 5.2 Tạo Loading Component

Tạo `components/ui/loading.tsx`:

```typescript
interface LoadingProps {
    message?: string
    size?: 'sm' | 'md' | 'lg'
}

export function Loading({ message = 'Loading...', size = 'md' }: LoadingProps) {
    const sizeClasses = {
        sm: 'h-8 w-8',
        md: 'h-16 w-16', 
        lg: 'h-32 w-32'
    }

    return (
        <div className="flex flex-col items-center justify-center p-8">
            <div className={`animate-spin rounded-full border-b-2 border-primary ${sizeClasses[size]}`}></div>
            <p className="mt-4 text-muted-foreground">{message}</p>
        </div>
    )
}
```

### 5.3 Tạo Error Component

Tạo `components/ui/error.tsx`:

```typescript
interface ErrorProps {
    message: string
    onRetry?: () => void
}

export function Error({ message, onRetry }: ErrorProps) {
    return (
        <div className="flex flex-col items-center justify-center p-8 text-center">
            <div className="text-red-500 mb-4">
                <svg className="w-16 h-16 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.732-.833-2.5 0L4.268 18.5c-.77.833.192 2.5 1.732 2.5z" />
                </svg>
            </div>
            <p className="text-red-600 mb-4">{message}</p>
            {onRetry && (
                <button 
                    onClick={onRetry}
                    className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition-colors"
                >
                    Try Again
                </button>
            )}
        </div>
    )
}
```

### 5.4 Cập nhật tất cả Pages

Áp dụng pattern tương tự cho tất cả pages:
- `app/fields/page.tsx`
- `app/tournaments/page.tsx`
- `app/community/page.tsx`
- `app/booking-history/page.tsx`
- Tất cả dynamic pages (`[id]`)

---

## 6. TESTING VÀ DEBUG

### 6.1 Kiểm tra Backend API

```bash
# Test API endpoints
curl http://localhost:3001/health
curl http://localhost:3001/api/sports
curl http://localhost:3001/api/fields/popular
curl http://localhost:3001/api/fields/1
```

### 6.2 Kiểm tra Frontend

```bash
# Start frontend
npm run dev

# Check browser console for errors
# Test these pages:
# http://localhost:3000/
# http://localhost:3000/fields
# http://localhost:3000/tournaments
# http://localhost:3000/fields/1
```

### 6.3 Common Issues và Solutions

#### Issue 1: CORS Error
```
Access to fetch at 'http://localhost:3001/api/sports' from origin 'http://localhost:3000' has been blocked by CORS
```

**Solution:** Cập nhật backend CORS config:
```typescript
app.use(cors({
  origin: ['http://localhost:3000', 'https://your-frontend-domain.com'],
  credentials: true
}))
```

#### Issue 2: API Response Format Mismatch
```
TypeError: Cannot read property 'data' of undefined
```

**Solution:** Ensure backend trả về đúng format:
```typescript
// Backend response format
res.json({
  success: true,
  data: result.rows,
  message: 'Success'
})
```

#### Issue 3: Database Connection Error
```
Error: connect ECONNREFUSED 127.0.0.1:5432
```

**Solution:** 
1. Kiểm tra PostgreSQL đang chạy: `pg_isready`
2. Kiểm tra DATABASE_URL trong .env
3. Kiểm tra firewall/ports

#### Issue 4: TypeScript Errors
```
Type 'unknown' is not assignable to type 'Field[]'
```

**Solution:** Add proper typing:
```typescript
const result = await pool.query<Field>('SELECT * FROM fields')
```

---

## 7. PRODUCTION DEPLOYMENT

### 7.1 Backend Deployment (Railway/Heroku)

#### Railway:
```bash
# Install Railway CLI
npm install -g @railway/cli

# Login and deploy
railway login
railway init
railway up
```

#### Heroku:
```bash
# Install Heroku CLI
# Create Heroku app
heroku create kickoff-api

# Add PostgreSQL addon
heroku addons:create heroku-postgresql:mini

# Deploy
git push heroku main
```

### 7.2 Database Migration to Production

```bash
# Get production database URL from hosting provider
# Example: postgres://user:pass@host:5432/dbname

# Run migrations
psql "postgres://user:pass@host:5432/dbname" < database/schema.sql
psql "postgres://user:pass@host:5432/dbname" < database/seed.sql
```

### 7.3 Frontend Deployment (Vercel)

Cập nhật `.env.production`:

```env
NEXT_PUBLIC_API_URL=https://your-api-domain.railway.app/api
NEXT_PUBLIC_API_MODE=production
```

Deploy:
```bash
# Install Vercel CLI
npm install -g vercel

# Deploy
vercel --prod
```

### 7.4 Environment Variables Setup

#### Backend (.env production):
```env
NODE_ENV=production
PORT=443
DATABASE_URL=postgres://user:pass@host:5432/dbname
JWT_SECRET=super-secure-production-secret
FRONTEND_URL=https://your-frontend-domain.vercel.app
```

#### Frontend (Vercel dashboard):
```
NEXT_PUBLIC_API_URL=https://your-api-domain.railway.app/api
NEXT_PUBLIC_API_MODE=production
```

---

## 8. MONITORING VÀ MAINTENANCE

### 8.1 Backend Monitoring

Thêm logging middleware:

```typescript
// src/middleware/logger.ts
import winston from 'winston'

const logger = winston.createLogger({
  level: 'info',
  format: winston.format.json(),
  transports: [
    new winston.transports.File({ filename: 'error.log', level: 'error' }),
    new winston.transports.File({ filename: 'combined.log' }),
    new winston.transports.Console({
      format: winston.format.simple()
    })
  ]
})

export default logger
```

### 8.2 Error Tracking

#### Frontend (Sentry):
```bash
npm install @sentry/nextjs

# pages/_app.tsx
import * as Sentry from '@sentry/nextjs'

Sentry.init({
  dsn: 'your-sentry-dsn'
})
```

#### Backend (Sentry):
```bash
npm install @sentry/node

# server.ts
import * as Sentry from '@sentry/node'

Sentry.init({
  dsn: 'your-sentry-dsn'
})
```

### 8.3 Performance Monitoring

#### Database Query Optimization:
```sql
-- Add indexes for common queries
CREATE INDEX idx_fields_rating ON fields(rating DESC);
CREATE INDEX idx_bookings_date_status ON bookings(date, status);
CREATE INDEX idx_reviews_field_rating ON reviews(field_id, rating);
```

#### API Caching:
```typescript
// Add Redis caching
import Redis from 'ioredis'
const redis = new Redis(process.env.REDIS_URL)

// Cache popular fields
router.get('/popular', async (req, res) => {
  const cacheKey = 'fields:popular'
  const cached = await redis.get(cacheKey)
  
  if (cached) {
    return res.json(JSON.parse(cached))
  }
  
  // ... fetch from database
  
  await redis.setex(cacheKey, 300, JSON.stringify(result)) // 5 minutes cache
})
```

### 8.4 Backup Strategy

#### Database Backup Script:
```bash
#!/bin/bash
# backup.sh

DATE=$(date +%Y%m%d_%H%M%S)
BACKUP_FILE="backup_${DATE}.sql"

pg_dump $DATABASE_URL > $BACKUP_FILE

# Upload to cloud storage (AWS S3, Google Cloud, etc.)
aws s3 cp $BACKUP_FILE s3://your-backup-bucket/
```

#### Automated Backups (crontab):
```bash
# Daily backup at 2 AM
0 2 * * * /path/to/backup.sh
```

---

## 🎉 HOÀN THÀNH!

### ✅ Checklist Final:

- [ ] Database setup và có data ✅
- [ ] Backend API running và tested ✅
- [ ] Frontend connected to real API ✅
- [ ] All pages working with real data ✅
- [ ] Error handling implemented ✅
- [ ] Loading states added ✅
- [ ] Production deployment completed ✅
- [ ] Monitoring setup ✅
- [ ] Backup strategy in place ✅

### 🚀 Next Steps:

1. **Thêm tính năng Authentication** (JWT, OAuth)
2. **Implement Chat system** (WebSocket, Socket.io)
3. **Add Payment gateway** (Stripe, PayPal)
4. **Mobile app** (React Native)
5. **Admin dashboard** cho quản lý

### 📞 Support:

Nếu gặp vấn đề trong quá trình migration:

1. Kiểm tra logs: backend logs, browser console
2. Test API endpoints với Postman/curl
3. Verify database connections
4. Check environment variables
5. Review network/CORS issues

**Chúc bạn thành công! 🎊**
