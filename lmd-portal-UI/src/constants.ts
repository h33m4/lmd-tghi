
// src/app/api/index.ts
export const API_URL = 'https://api.example.com';

// src/app/api/access.ts
export const HOST = 'smtp.example.com';
export const PORT = 587;
export const SECURE = false;
export const AUTH = { user: process.env.ADMIN_EMAIL, password: process.env.ADMIN_PASSWORD };

// src/hooks/login.ts
export const USER_POOL_ID = 'us-east-1_xxxxxxxxx'
export const USER_POOL_CLIENT_ID = 'xxxxxxxxxxxxxxxxxxxxxxxxxx'