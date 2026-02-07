-- USERS (Authentication and Accounts)
CREATE TABLE users (
    id SERIAL PRIMARY KEY,
    username VARCHAR(50) UNIQUE NOT NULL,
    email VARCHAR(100) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- FILES
CREATE TABLE files (
    id SERIAL PRIMARY KEY,
    
    -- Link to user (Nullable because guest uploads are allowed)
    user_id INT REFERENCES users(id) ON DELETE SET NULL,
    
    -- The shareable part of the URL
    unique_code VARCHAR(20) UNIQUE NOT NULL,
    
    -- Polymorphic Storage: Tracks if it is text or a file
    type VARCHAR(10) CHECK (type IN ('text', 'file')) NOT NULL,
    
    -- Content Columns
    text_content TEXT,
    file_url TEXT,            -- Path to storage
    original_name VARCHAR(255),
    mime_type VARCHAR(100),
    size_bytes BIGINT,

    -- Security Features
    password_hash VARCHAR(255), -- Null if public
    is_one_time BOOLEAN DEFAULT FALSE, -- Auto-delete after 1 view
    
    -- Usage Limits
    max_views INT,            -- Null = Unlimited
    view_count INT DEFAULT 0, -- Tracks actual views
    
    -- Expiry (Critical for cleanup)
    expires_at TIMESTAMPTZ NOT NULL,
    created_at TIMESTAMPTZ DEFAULT NOW(),

    -- Data Integrity: Ensure we do not have empty rows
    CONSTRAINT check_content_exists CHECK (
        (type = 'text' AND text_content IS NOT NULL) OR 
        (type = 'file' AND file_url IS NOT NULL)
    )
);

-- ACCESS LOGS: Tracks who clicked what and when
CREATE TABLE access_logs (
    id SERIAL PRIMARY KEY,
    file_id INT REFERENCES files(id) ON DELETE CASCADE,
    ip_address INET,
    user_agent TEXT,
    accessed_at TIMESTAMPTZ DEFAULT NOW()
);

-- 4. INDEXES
CREATE INDEX idx_files_code ON files(unique_code);
CREATE INDEX idx_files_expiry ON files(expires_at);
CREATE INDEX idx_logs_file_id ON access_logs(file_id);