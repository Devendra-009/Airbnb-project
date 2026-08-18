import "dotenv/config";
import app from "./app.js";
import { connectDB } from "./config/db.js";

const port = Number(process.env.PORT || 8080);

connectDB()
    .then(() => {
        app.listen(port, () => {
            console.log(`API running on port ${port}`);
        });
    })
    .catch((err) => {
        console.error("Database connection failed:", err);
        process.exit(1);
    });