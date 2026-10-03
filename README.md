# CCE106 Practical Laboratory Examination

## Student Service Portal

### Student Information

Name: Cesario G. Am-is Jr

Section: CCE 106-2063

Date: 2026-10-03

### Required Features

- [x] Login
- [x] Authentication state
- [x] Secure token storage
- [x] Protected navigation
- [x] Dashboard
- [x] Student API request
- [x] Loading state
- [x] Error state
- [x] Empty state
- [x] Search/filter
- [x] Dynamic student details
- [x] Profile
- [x] Session restoration
- [x] Logout

### API

The app currently uses DummyJSON, as confirmed with the Postman login request.
Set `EXPO_PUBLIC_API_BASE_URL` to change the API base URL.

POST /auth/login with `{ "username": "...", "password": "..." }`

GET /auth/me

GET /users

GET /users/{id}

The student screens use DummyJSON's sample users as student records. These are
demo records, not records from the instructor's student database.

### How to Run

```sh
npm install
npx expo start
```

Press `w` for web. The app checks platform availability before using SecureStore;
web sessions are kept in memory only.

The app opens on the sign-in screen when there is no active session. Use the
DummyJSON demo credentials `emilys` / `emilyspass` to sign in. Preview a student
detail at `/student/1` after signing in.

Expo SecureStore is used in `context/AuthContext.tsx` for native token storage.
See the [Expo SDK 54 SecureStore documentation](https://docs.expo.dev/versions/v54.0.0/sdk/securestore/).

Compiler and lint checks:

```sh
npx tsc --noEmit
npm run lint
```

### Required Git Commits

Students must create at least five meaningful commits.

Suggested examples:

- `exam: setup navigation`
- `exam: implement login`
- `exam: integrate student api`
- `exam: add dynamic student details`
- `exam: implement session and logout`

### Submission

Submit the GitHub repository URL according to the instructor's instructions.
