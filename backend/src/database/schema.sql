-- Create the table if it doesn't exist
CREATE TABLE IF NOT EXISTS uploads (
    id SERIAL PRIMARY KEY,
    
    -- The 6-character unique code (e.g., 'Xy9z1A')
    code VARCHAR(10) UNIQUE NOT NULL,
    
    -- Type: 'text' or 'file'
    type VARCHAR(10) CHECK (type IN ('text', 'file')) NOT NULL,
    
    -- CONTENT:
    text_content TEXT,               -- Stores text if type is 'text'
    file_path TEXT,                  -- Stores 'uploads/filename.ext' if type is 'file'
    original_name VARCHAR(255),      -- Original filename for download
    mime_type VARCHAR(100),          -- e.g., 'application/pdf'
    size_bytes BIGINT,               -- File size

    -- SECURITY FEATURES:
    password_hash VARCHAR(255),      -- Bcrypt hash (Nullable)
    
    -- EXPIRY & LIMITS:
    created_at TIMESTAMPTZ DEFAULT NOW(),
    expires_at TIMESTAMPTZ NOT NULL, -- Calculated on upload
    max_views INT,                   -- Null = Unlimited
    view_count INT DEFAULT 0,        -- Tracks how many times viewed
    is_one_time BOOLEAN DEFAULT FALSE -- "Burn after read" flag
);

-- Index for fast lookup by code
CREATE INDEX IF NOT EXISTS idx_uploads_code ON uploads(code);