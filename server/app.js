import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import helmet from "helmet";
import rateLimit from "express-rate-limit";
import morgan from "morgan";

import authRoutes from "./routes/auth.js";
import userRoutes from "./routes/users.js";
import listingRoutes from "./routes/listings.js";
import bookingRoutes from "./routes/bookings.js";
import reviewRoutes from "./routes/reviews.js";
import adminRoutes from "./routes/admin.js";

import { errorHandler, notFound } from "./middleware/error.js";

const app = express();

/* =========================================================
   CORS CONFIGURATION
========================================================= */

const allowedOrigins = [
    "http://localhost:5173",
    "http://127.0.0.1:5173",
    process.env.CLIENT_URL
].filter(Boolean);

console.log("=================================");
console.log("CLIENT_URL:", process.env.CLIENT_URL);
console.log("Allowed CORS Origins:", allowedOrigins);
console.log("=================================");

app.use(
    cors({
        origin: function (origin, callback) {

            // Allow requests without Origin
            // Example: Postman, server-to-server requests
            if (!origin) {
                return callback(null, true);
            }

            // Allow registered origins
            if (allowedOrigins.includes(origin)) {
                return callback(null, true);
            }

            console.log("❌ Blocked CORS origin:", origin);

            // Do not throw an error.
            // Simply don't allow the origin.
            return callback(null, false);
        },

        credentials: true,

        methods: [
            "GET",
            "POST",
            "PUT",
            "PATCH",
            "DELETE",
            "OPTIONS"
        ],

        allowedHeaders: [
            "Content-Type",
            "Authorization"
        ]
    })
);


/* =========================================================
   SECURITY
========================================================= */

app.use(
    helmet({
        crossOriginResourcePolicy: {
            policy: "cross-origin"
        }
    })
);


/* =========================================================
   BODY PARSERS
========================================================= */

app.use(
    express.json({
        limit: "2mb"
    })
);

app.use(
    express.urlencoded({
        extended: true
    })
);

app.use(cookieParser());


/* =========================================================
   LOGGING
========================================================= */

app.use(morgan("dev"));


/* =========================================================
   RATE LIMIT
========================================================= */

const limiter = rateLimit({
    windowMs: 15 * 60 * 1000,
    max: 300,
    standardHeaders: true,
    legacyHeaders: false,

    message: {
        success: false,
        message: "Too many requests. Please try again later."
    }
});

app.use(limiter);


/* =========================================================
   HEALTH CHECK
========================================================= */

app.get("/api/health", (req, res) => {
    res.json({
        success: true,
        message: "ExploreLust API is running"
    });
});

app.get("/favicon.ico", (req, res) => {
    res.status(204).end();
});


/* =========================================================
   API ROUTES
========================================================= */

app.use("/api/auth", authRoutes);

app.use("/api/users", userRoutes);

app.use("/api/listings", listingRoutes);

app.use("/api/bookings", bookingRoutes);

app.use("/api/reviews", reviewRoutes);

app.use("/api/admin", adminRoutes);


/* =========================================================
   404 HANDLER
========================================================= */

app.use(notFound);


/* =========================================================
   GLOBAL ERROR HANDLER
========================================================= */

app.use(errorHandler);


export default app;