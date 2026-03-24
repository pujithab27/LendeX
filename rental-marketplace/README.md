# LendeX - P2P Rental Marketplace

A full-stack, production-ready Peer-to-Peer Rental Marketplace built using the MERN stack + Firebase + Razorpay.

## Features
- **User Roles:** Renter, Merchant, Admin.
- **Product Listing:** Merchants can list items with images and pricing.
- **Booking Flow:** Calendar-based date selection, preventing double bookings on overlapping dates.
- **Payment:** Integrated with Razorpay for handling payments securely.
- **Firebase Auth:** Email/password and social login ready.
- **Messaging:** Built-in real-time chat between Renters and Merchants.
- **Reviews:** Rating system for past completed bookings.
- **State Machine:** Robust booking lifecycle (REQUESTED -> OUT_FOR_DELIVERY -> DELIVERED -> RETURN_REQUESTED -> COMPLETED).

## Tech Stack
- **Frontend:** Vanilla HTML5, Custom CSS (`style.css`), Vanilla JavaScript (ES Modules).
- **Backend:** Node.js, Express.js, MongoDB (Mongoose).
- **Services:** Firebase (Auth, Admin), Razorpay (Payments).

---

## Setup Instructions

### 1. Pre-requisites
- Node.js (v18+)
- MongoDB running locally or MongoDB Atlas connection string
- Firebase Project (Client keys + Service Account JSON)
- Razorpay Test Account (Key ID & Key Secret)

### 2. Backend Setup
1. Open terminal and navigate to backend:
   ```bash
   cd backend
   npm install
   ```
2. Setup environment variables. Create `.env` inside `backend/`:
   ```env
   PORT=5000
   MONGODB_URI=mongodb://localhost:27017/rental-marketplace
   JWT_SECRET=your_jwt_secret
   RAZORPAY_KEY_ID=your_razorpay_key
   RAZORPAY_KEY_SECRET=your_razorpay_secret
   FIREBASE_PROJECT_ID=your_project_id
   FIREBASE_CLIENT_EMAIL=your_client_email
   FIREBASE_PRIVATE_KEY="your_private_key"
   ```
3. Run the server:
   ```bash
   npm run dev
   # or
   npx nodemon server.js
   ```

### 3. Frontend Setup
1. The frontend is built with pure Vanilla HTML, CSS, and JS, so **no build step is required!**
2. Setup environment variables by editing `frontend/js/auth.js` and replacing the `firebaseConfig` block with your actual Firebase Console keys.
3. Open `frontend/index.html` in your browser.
*(Alternatively, because `backend/server.js` serves the `../frontend` folder statically, simply running the backend and visiting `http://localhost:5000` will render the application beautifully).*

### 4. Sample Data
Ensure your backend is running (`npm run dev`), then run the seed script to populate sample products:
```bash
cd backend
node seed.js
```

---

## API Endpoints Overview

- **Auth:**
  - `POST /api/auth/sync`
  - `GET /api/auth/profile`
- **Products:**
  - `GET /api/products`
  - `GET /api/products/:id`
  - `POST /api/products` (Merchant only)
- **Bookings:**
  - `POST /api/bookings`
  - `GET /api/bookings/my-rentals`
  - `GET /api/bookings/merchant`
  - `PUT /api/bookings/:id/status`
- **Payments:**
  - `POST /api/payments/create-order`
  - `POST /api/payments/verify`
- **Chat:**
  - `POST /api/chat/conversation`
  - `GET /api/chat/conversations`
  - `GET /api/chat/:conversationId/messages`
  - `POST /api/chat/:conversationId/messages`
