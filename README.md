# LinkVault

LinkVault is a web app where you can upload text or files and get a shareable link. Links can be password-protected, set to expire, or configured to self-destruct after being viewed. Optionally create an account to manage your uploads from a dashboard.

---

## Tech Stack

- **Frontend:** React 19, Vite 7, Tailwind CSS 3, react-router-dom 7
- **Backend:** Node.js, Express 5
- **Database:** SQLite 3
- **Auth:** JWT, bcrypt
- **File handling:** Multer (local disk, 100 MB limit)

---

## Project Structure

```
backend/
  server.js                  # Express entry point, mounts routes, starts cleanup
  src/
    config/db.js             # SQLite connection and table init
    controllers/
      authController.js      # Register, login, getMe
      uploadController.js    # Handles text and file uploads
      fileController.js      # View, download, list, delete
    middlewares/
      authMiddleware.js      # JWT verification
      uploadMiddleware.js    # Multer config
      validationMiddleware.js
    routes/
      authRoutes.js
      uploadRoutes.js
      fileRoutes.js
    utils/cleanupJob.js      # Periodic expired upload deletion

frontend/src/
  App.jsx                    # Route definitions
  api.js                     # API base URL + fetch wrapper
  AuthContext.jsx            # Auth state (login, register, logout)
  components/
    Navbar.jsx
    MainLayout.jsx
    UploadCard.jsx
  hooks/useUpload.js         # Upload form logic
  pages/
    Home.jsx, Login.jsx, Register.jsx, Dashboard.jsx, ViewPage.jsx
```

---

## Setup

**Prerequisites:** Node.js v18+, npm

### Backend

```bash
cd backend
npm install
```

Create `backend/.env`:

```
PORT=5000
JWT_SECRET=pick-something-long-and-random
```

```bash
npm run dev
```

The server starts on port 5000. SQLite creates the database file automatically on first run.

### Frontend

```bash
cd frontend
npm install
npm run dev
```

Opens on `http://localhost:5173`. Hit the browser and start uploading right away -- no account needed.

---

## API Overview

Base URL: `http://localhost:5000/api`

### Auth

| Method | Endpoint         | Auth | Body                            | What it does              |
| ------ | ---------------- | ---- | ------------------------------- | ------------------------- |
| POST   | `/auth/register` | No   | `{ fullName, email, password }` | Create account, get token |
| POST   | `/auth/login`    | No   | `{ email, password }`           | Log in, get token         |
| GET    | `/auth/me`       | Yes  | --                              | Get current user info     |

### Upload

| Method | Endpoint  | Auth     | Body (multipart/form-data)                                                 |
| ------ | --------- | -------- | -------------------------------------------------------------------------- |
| POST   | `/upload` | Optional | `type`, `content` or `file`, `password`, `expiry`, `maxViews`, `isOneTime` |

Returns `{ uniqueCode, expiresAt }`. If logged in, the upload is linked to your account.

### Files

| Method | Endpoint                | Auth | What it does                          |
| ------ | ----------------------- | ---- | ------------------------------------- |
| GET    | `/files/:code`          | No   | View text content or file metadata    |
| POST   | `/files/:code`          | No   | Same, but send `{ password }` in body |
| GET    | `/files/:code/download` | No   | Download the file                     |
| GET    | `/files/user/my-files`  | Yes  | List your uploads                     |
| DELETE | `/files/:code`          | Yes  | Delete your upload                    |

Status codes: `400` validation error, `401` no auth, `403` wrong password, `404` not found, `410` expired.

---

## Database

Two tables in SQLite, auto-created on startup:

**users** -- `id`, `email` (unique), `password_hash`, `full_name`, `created_at`

**uploads** -- `id`, `user_id` (nullable FK), `code` (unique), `type` (text/file), `text_content`, `file_path`, `original_name`, `mime_type`, `size_bytes`, `password_hash`, `expires_at`, `max_views`, `view_count`, `is_one_time`, `created_at`

---

## Design Decisions

**SQLite** -- No database server to install. The whole DB is one file. Good enough for this scale.

**Local disk storage over cloud** -- Keeps the app self-contained. Multer saves files to `uploads/`, the DB stores the path. Swapping to S3 later would only mean changing the storage backend in Multer.

**Background cleanup job** -- Runs every 60 seconds, deletes expired uploads from disk and DB. Without this, files from links nobody revisits would sit around forever. The server also checks expiry at request time, so expired content is never served even if the cleanup hasn't run yet.

**GET and POST for the same `/files/:code`** -- GET works for public links. POST lets you send a password in the body for protected links. Same handler, no duplicated logic.

**Upload without login** -- Anyone can upload without an account. If you happen to be logged in, the upload gets tied to your account so you can manage it later from the dashboard.

**Stateless JWT auth** -- No server-side sessions. A signed token in the header is all that's needed. 7-day expiry so you don't have to log in every time.

**Frontend structure** -- Components, hooks, and pages each get one directory. No deep nesting for this project.

---

## Data Flow

**Upload:** User fills the form -> frontend builds FormData -> `POST /api/upload` -> Multer saves file to disk (if file) -> validation middleware checks inputs -> controller generates a 6-char hex code, hashes password if set, calculates expiry, inserts DB row -> returns the unique code to the frontend -> user gets a shareable link.

**View:** Someone opens `/v/<code>` -> frontend hits `GET /api/files/<code>` -> controller looks up the code, checks expiry, checks password, bumps view count -> returns text content or file metadata -> if burn-after-reading or max views hit, deletes the upload.

**Cleanup:** On server start, a setInterval runs every 60s -> queries for uploads past their `expires_at` -> deletes the file from disk and the row from the DB.

---

## Assumptions and Limitations

- Runs on a single server with local storage. No distributed setup.
- SQLite handles the expected load fine. Not built for heavy concurrent writes.
- The `uploads/` directory must be writable by the Node process.
- No rate limiting. Could be added with express-rate-limit.
- No email verification on signup.
- 6 hex chars gives around 16 million unique codes. Enough for this use case.
- No file type restrictions beyond the 100 MB size cap.
