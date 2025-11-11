-- Database Schema cho KickOff App

-- Users table
CREATE TABLE users (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name VARCHAR(255) NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    phone VARCHAR(20),
    avatar TEXT,
    bio TEXT,
    location VARCHAR(255),
    favorite_sports TEXT[], -- Array of sport names
    notifications JSONB DEFAULT '{"booking": true, "tournament": false, "community": true, "email": true, "push": false}',
    stats JSONB DEFAULT '{"totalBookings": 0, "totalTournaments": 0, "totalPosts": 0}',
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
);

-- Sports table
CREATE TABLE sports (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name VARCHAR(100) NOT NULL,
    icon VARCHAR(10),
    image TEXT,
    description TEXT,
    field_count INTEGER DEFAULT 0,
    created_at TIMESTAMP DEFAULT NOW()
);

-- Fields table
CREATE TABLE fields (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name VARCHAR(255) NOT NULL,
    location VARCHAR(255) NOT NULL,
    price INTEGER NOT NULL, -- VND per hour
    rating DECIMAL(2,1) DEFAULT 0,
    image TEXT,
    sport VARCHAR(100) NOT NULL,
    amenities TEXT[], -- Array of amenities
    description TEXT,
    owner_id UUID REFERENCES users(id),
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
);

-- Tournaments table
CREATE TABLE tournaments (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name VARCHAR(255) NOT NULL,
    sport VARCHAR(100) NOT NULL,
    start_date DATE NOT NULL,
    end_date DATE NOT NULL,
    location VARCHAR(255) NOT NULL,
    prize_pool INTEGER NOT NULL, -- VND
    max_teams INTEGER NOT NULL,
    current_teams INTEGER DEFAULT 0,
    image TEXT,
    description TEXT,
    registration_fee INTEGER DEFAULT 0,
    organizer_id UUID REFERENCES users(id),
    status VARCHAR(50) DEFAULT 'upcoming',
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
);

-- Community Posts table
CREATE TABLE community_posts (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    title VARCHAR(255) NOT NULL,
    content TEXT NOT NULL,
    author_id UUID REFERENCES users(id),
    sport VARCHAR(100) NOT NULL,
    location VARCHAR(255),
    event_date DATE,
    event_time VARCHAR(50),
    level VARCHAR(100),
    participants INTEGER DEFAULT 0,
    max_participants INTEGER DEFAULT 20,
    cost VARCHAR(100),
    likes INTEGER DEFAULT 0,
    comments_count INTEGER DEFAULT 0,
    tags TEXT[],
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
);

-- Bookings table
CREATE TABLE bookings (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    field_id UUID REFERENCES fields(id),
    user_id UUID REFERENCES users(id),
    booking_date DATE NOT NULL,
    start_time TIME NOT NULL,
    end_time TIME NOT NULL,
    duration INTEGER NOT NULL, -- minutes
    status VARCHAR(50) DEFAULT 'confirmed', -- confirmed, completed, cancelled
    total_price INTEGER NOT NULL, -- VND
    court VARCHAR(100),
    notes TEXT,
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
);

-- Reviews table
CREATE TABLE reviews (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    field_id UUID REFERENCES fields(id),
    user_id UUID REFERENCES users(id),
    rating INTEGER NOT NULL CHECK (rating >= 1 AND rating <= 5),
    comment TEXT,
    images TEXT[], -- Array of image URLs
    created_at TIMESTAMP DEFAULT NOW()
);

-- Chat Rooms table
CREATE TABLE chat_rooms (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name VARCHAR(255) NOT NULL,
    type VARCHAR(50) NOT NULL, -- 'group' or 'private'
    created_by UUID REFERENCES users(id),
    created_at TIMESTAMP DEFAULT NOW()
);

-- Chat Messages table
CREATE TABLE chat_messages (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    room_id UUID REFERENCES chat_rooms(id),
    sender_id UUID REFERENCES users(id),
    content TEXT NOT NULL,
    message_type VARCHAR(50) DEFAULT 'text', -- 'text', 'image', 'file'
    created_at TIMESTAMP DEFAULT NOW()
);

-- Room Participants table
CREATE TABLE room_participants (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    room_id UUID REFERENCES chat_rooms(id),
    user_id UUID REFERENCES users(id),
    joined_at TIMESTAMP DEFAULT NOW(),
    UNIQUE(room_id, user_id)
);

-- Indexes for performance
CREATE INDEX idx_users_email ON users(email);
CREATE INDEX idx_fields_sport ON fields(sport);
CREATE INDEX idx_bookings_user_date ON bookings(user_id, booking_date);
CREATE INDEX idx_reviews_field ON reviews(field_id);
CREATE INDEX idx_community_posts_sport ON community_posts(sport);
CREATE INDEX idx_chat_messages_room ON chat_messages(room_id, created_at);
