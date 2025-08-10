# React File Manager (Tailwind v4)

This is a minimal Vite + React scaffold configured for **Tailwind v4** with the requested pages:
- Login, Register, Forgot Password, Reset Password
- Dashboard with Upload, View files, Download and Delete

**API endpoints used (as you provided):**
- Auth base: http://localhost:5050/api/auth
  - POST /register, /login, /refresh, /verify-email, /forgot, /reset
- Files base: http://localhost:5055/api/files
  - GET /, GET /download/:fileId, GET /:fileId, POST /upload, DELETE /:fileId

## How to run

1. Install deps:
```bash
cd react-file-manager-tailwind4
npm install
```

2. Run dev server:
```bash
npm run dev
```

3. Tailwind is already configured (v4 in package.json). If you need to adapt to Tailwind v3 change package.json accordingly.

## Notes / assumptions

- The app assumes `login` returns `{ accessToken, refreshToken }`.
- File objects returned by files GET are expected to have `id` or `_id`, `name`/`filename`, `size`.
- Download links use: `http://localhost:5055/api/files/download/:fileId`
- This is a scaffold to get you started; refine validations, error handling and UI as needed.
