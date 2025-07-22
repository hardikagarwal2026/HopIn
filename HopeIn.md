🎯 User Journey: Peer-to-Peer Campus Ride Sharing Platform

💡 Actors:
- Rider (Looking for a ride)
- Driver (Offering a ride — even if it’s temporary, both are peers)
- System: React frontend + Go backend + MongoDB + SQL + Firebase

🔰 1. Onboarding & Authentication
**Goal:** Ensure only verified university students use the platform.
- User lands on website (public route): CTA: Login with Google
- **Authentication Flow:**
  - Only **Google Sign-In** is supported for simplicity and security.
  - **Frontend:**
    - Use **Firebase Authentication** with `signInWithPopup(GoogleAuthProvider)`.
    - After login, extract user's email and check domain (`@srmist.edu.in`).
    - If domain is invalid → show blocking message.
    - If valid → pass `idToken` to Go backend via `/api/v1/auth/google`.
  - **Backend (Go):**
    - Verify token with Google's public certs (or use Firebase Admin SDK).
    - Extract `email`, `name`, `uid` from token.
    - Ensure email domain ends with `@srmist.edu.in`.
    - Check if user exists in MongoDB. If not, create user profile.
    - Save session info / metadata.
    - Generate **JWT token** (stored in cookie or returned to frontend).
  - Final Redirect: `/dashboard/map`

🧭 2. Home Dashboard (Interactive Map)
**Goal:** Let users see who else is active and start a ride search or offer.
- Map loads via Google Maps/Mapbox, centered on user
- Backend fetches:
  - Nearby active users
  - Nearby open ride requests
- Frontend displays:
  - FAB: Post a Ride
  - User Pins: Avatar + availability status
  - Request Pins: Icons for "Seeking Ride"
  - Real-time updates via Firebase or WebSocket

🛣️ 3. Posting a Ride Request (Rider Journey)
**Goal:** A student needs a ride.
- FAB opens Material Design modal:
  - Start location auto-filled via GPS
  - Destination (Google Places autocomplete)
  - Fare Offering input (validated currency)
  - Time of departure (now/later)
  - Seats needed (optional)
- On Submit:
  - SQL DB: insert into `ride_requests` (user_id, from, to, fare, time, status='active')
  - Mongo: store user activity and pinned location
  - Backend:
    - Searches for nearby matching drivers
    - Sends push notifications to matches

🚗 4. Offering a Ride (Driver Journey)
**Goal:** A student offers a ride (pre-planned or spontaneous).
- FAB → "Offer a Ride" tab:
  - Inputs: Start, Destination, Fare, Seats available, Departure Time
- On Submit:
  - SQL: insert into `rides`
  - Mongo: update user status = `available_to_drive`
  - Notify nearby riders

🔍 5. Matching & Discovery
**Goal:** Let riders find drivers and vice versa.
- Sidebar/modal with ride listings:
  - Show: Name, route, fare, match %
  - Filters: time, fare, proximity
- Actions:
  - Rider: `Request to Join`
    - Notification to driver
    - Request dialog opens
  - Driver: `Accept` / `Reject`
    - On Accept:
      - Initialize chat
      - Store match in Mongo
      - Start realtime sync

💬 6. Real-time Chat + Location Sharing
**Goal:** Build trust, coordinate exact meetups.
- Chat opens post-match
- Features:
  - Avatars, timestamps
  - Emojis
  - Share Location: live GPS or pinned
  - Read receipts
- Powered by Firebase Realtime DB / Firestore

📲 7. Notifications
**Goal:** Keep users informed passively.
- Via Firebase Cloud Messaging:
  - New ride match
  - Ride accepted/rejected
  - Chat messages
  - Ride updates
- In-app: toasts/snackbars with vibration/sound options

📋 8. Ride History & Reviews
**Goal:** Build user trust via feedback loop.
- After ride:
  - Prompt both users to rate & review
  - SQL: store in `ride_reviews` (ride_id, rater_id, ratee_id, score, comment)
- Profile view:
  - Ratings
  - Ride logs
  - Feedback

⚙️ 9. Profile & Settings
- View/Edit personal info
- Google profile pic sync
- Notification preferences
- Default start location (optional)
- Privacy settings
- Secure logout

🔄 10. Real-Time Infrastructure
- MongoDB + Firebase track user presence
- SQL stores ride & match data
- Firebase:
  - Location updates
  - Chat sync
- WebSockets/Firebase for live ride status updates

🛠️ Frontend Guidance (React + MUI)
- Use **React Router** for page navigation.
- Use **Material UI (MUI)** for all components: buttons, dialogs, modals, input fields.
- **Google Maps React library** (e.g., `@react-google-maps/api`) for embedding and controlling map.
- Use **Axios** for API requests to Go backend.
- **State Management:** Start with local state + Context API. If needed, move to Redux Toolkit.
- Always validate forms with **React Hook Form + Yup**.
- Keep UI responsive using MUI Grid and Flexbox.
- Modular folder structure:
  - `components/`: Reusable UI blocks
  - `pages/`: Route-bound components (Map, Profile, etc.)
  - `services/`: API calls and business logic
  - `hooks/`: Reusable logic (e.g., useAuth, useRideRequests)
  - `context/`: Auth context, theme context, etc.

🔧 Backend Guidance (Go + Fiber + GORM + Mongo)
- Use **Fiber** or **Gin** for fast REST APIs.
- Structure APIs under `/api/v1/`
- Use **GORM** with SQL DB (PostgreSQL/MySQL) for ride-related data.
- Use **MongoDB (official Go driver)** for dynamic data (chat, sessions, locations).
- Use **JWT middleware** for protected routes:
  - Middleware validates token from frontend
  - Inject user info into request context
- Use **Google OAuth / Firebase Admin SDK** to validate `idToken` during login
- Match-making logic can run in:
  - Real-time (Go routine)
  - Scheduled job (cron)
- Suggested structure:
  - `handlers/`: HTTP endpoint logic
  - `services/`: Business rules
  - `models/`: GORM + Mongo schemas
  - `routes/`: Route groups and middleware
  - `utils/`: JWT handling, token validation, etc.
- Use `godotenv` to load secrets from `.env`

🧪 Developer Tips
- Use **Postman** to test APIs.
- Use **Insomnia** or **Thunder Client** for quick frontend testing.
- Log clearly in both frontend (console.log) and backend (`log.Println`).
- Suggested Dev Order:
  1. Auth (Google Sign-In + JWT)
  2. Post Ride & Offer Ride Flows
  3. Real-time Map + Pins
  4. Ride Matching + Notifications
  5. Realtime Chat + Ratings


