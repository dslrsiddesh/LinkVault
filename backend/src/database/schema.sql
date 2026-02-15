-- =============================================
-- USERS TABLE
-- =============================================
-- Stores registered user accounts
CREATE TABLE IF NOT EXISTS users (
    id INTEGER AUTO_INCREMENT PRIMARY KEY,
    full_name TEXT NOT NULL,
    email TEXT UNIQUE NOT NULL,
    password_hash TEXT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Index for fast lookup by email
CREATE INDEX IF NOT EXISTS idx_users_email ON users(email);

-- =============================================
-- UPLOADS TABLE
-- =============================================
-- Stores uploaded files and text snippets
CREATE TABLE IF NOT EXISTS uploads (    
    id INTEGER AUTO_INCREMENT PRIMARY KEY ,
    
    -- The 6-character unique code (e.g., 'Xy9z1A')
    code TEXT UNIQUE NOT NULL,
    
    -- Type: 'text' or 'file'
    type TEXT CHECK (type IN ('text', 'file')) NOT NULL,
    
    -- CONTENT:
    text_content TEXT,               -- Stores text if type is 'text'
    file_path TEXT,                  -- Stores 'uploads/filename.ext' if type is 'file'
    original_name TEXT,              -- Original filename for download
    mime_type TEXT,                  -- e.g., 'application/pdf'
    size_bytes INTEGER,              -- File size

    -- SECURITY FEATURES:
    password_hash TEXT,              -- Bcrypt hash (Nullable)
    
    -- EXPIRY & LIMITS:
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    expires_at TIMESTAMP NOT NULL,   -- Calculated on upload
    max_views INTEGER,               -- Null = Unlimited
    view_count INTEGER DEFAULT 0,    -- Tracks how many times viewed
    is_one_time INTEGER DEFAULT 0    -- "Burn after read" flag (0 = false, 1 = true)
);

-- Index for fast lookup by code
CREATE INDEX IF NOT EXISTS idx_uploads_code ON uploads(code);