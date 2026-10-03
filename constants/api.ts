// DummyJSON API confirmed through the Postman login request.
export const API_BASE_URL = process.env.EXPO_PUBLIC_API_BASE_URL || 'https://dummyjson.com';

// POST /auth/login { username, password }
// GET /auth/me, GET /users, GET /users/{id}
