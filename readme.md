# ExploreLust — Modern MERN Full-Stack Booking Platform

This is a React + Express + MongoDB modernization of the original ExploreLust project.

## Stack
- Frontend: React 19, Vite, React Router, Axios, Tailwind CSS
- Backend: Node.js, Express, Mongoose
- Auth: JWT in httpOnly cookies, bcryptjs
- Images: Cloudinary + Multer
- Email: Nodemailer
- Security: Helmet, CORS, rate limiting, validation
- Database: MongoDB Atlas

## Main features
- Register / login / logout
- JWT authentication with protected routes
- User profile and profile-image upload
- Listing CRUD with ownership checks
- Cloudinary image uploads
- Search, category, price, guests and location filters
- Pagination and sorting
- Listing details with reviews
- Favorites / wishlist
- Booking creation with date-overlap availability checks
- Booking cancellation
- Booking confirmation email
- My listings
- My bookings
- User dashboard
- Admin dashboard and listing/user/booking management
- Responsive React UI
- Central API client and auth state
- Consistent API error handling
- MongoDB ObjectId relationships and indexes

## Folder structure
```text
FULLSTACK_UPDATED/
├── client/
│   ├── src/
│   │   ├── components/
│   │   ├── context/
│   │   ├── layouts/
│   │   ├── pages/
│   │   ├── services/
│   │   ├── App.jsx
│   │   ├── main.jsx
│   │   └── index.css
│   ├── .env.example
│   ├── index.html
│   ├── package.json
│   ├── postcss.config.js
│   ├── tailwind.config.js
│   └── vite.config.js
├── server/
│   ├── config/
│   ├── controllers/
│   ├── middleware/
│   ├── models/
│   ├── routes/
│   ├── utils/
│   ├── app.js
│   ├── server.js
│   ├── package.json
│   └── .env.example
├── .gitignore
└── README.md
```

## 1. MongoDB setup

Create a MongoDB Atlas database and get its connection string.

In `server/.env`:

```env
MONGO_URI=mongodb+srv://YOUR_DB_USER:YOUR_DB_PASSWORD@YOUR_CLUSTER.mongodb.net/explorelust?retryWrites=true&w=majority
JWT_SECRET=replace-with-a-long-random-secret
CLIENT_URL=http://localhost:5173
```

**Do not commit `.env` files or real credentials.**

## 2. Cloudinary

Create a Cloudinary account and add:

```env
CLOUDINARY_CLOUD_NAME=...
CLOUDINARY_API_KEY=...
CLOUDINARY_API_SECRET=...
```

## 3. Email

For Gmail SMTP, use an App Password:

```env
MAIL_HOST=smtp.gmail.com
MAIL_PORT=587
MAIL_USER=your-email@gmail.com
MAIL_PASS=your-gmail-app-password
```

## 4. Run

Terminal 1:
```bash
cd server
npm install
npm run dev
```

Terminal 2:
```bash
cd client
npm install
npm run dev
```

Open `http://localhost:5173`.

## API
Base URL: `http://localhost:8080/api`

Important routes:
- `POST /api/auth/register`
- `POST /api/auth/login`
- `POST /api/auth/logout`
- `GET /api/auth/me`
- `GET /api/listings`
- `POST /api/listings`
- `GET /api/listings/:id`
- `PUT /api/listings/:id`
- `DELETE /api/listings/:id`
- `POST /api/listings/:id/favorite`
- `GET /api/favorites`
- `POST /api/listings/:id/reviews`
- `GET /api/bookings`
- `POST /api/bookings`
- `DELETE /api/bookings/:id`
- `GET /api/users/me`
- `PUT /api/users/me`
- `GET /api/admin/stats`

## Migrating your old MongoDB data

The old project uses the same core entities: User, Listing, Review and Booking. The new schemas are designed around MongoDB ObjectIds and add indexes/metadata.

Before migrating production data, take a database backup. If you want, export your old collections and map fields:
- `username` → `name`
- `profileImage` → `avatar`
- `listing.image.url` → `images[0].url`
- `listing.owner` remains the ObjectId owner reference
- `listing.reviews` remains ObjectId references
- `booking.listing` and `booking.user` remain ObjectId references

Do not copy the old `.env` into this project because the uploaded project contained live-looking credentials. Rotate any credentials that were previously committed to Git or shared.
