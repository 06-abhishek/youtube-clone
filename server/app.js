import express from "express";
import cookieParser from "cookie-parser";
import cors from "cors";
import dotenv from "dotenv";

// Import Routes
import userRouter from "./routes/user.route.js";
import videosRouter from "./routes/video.route.js";

const app = express();
dotenv.config();

const allowedOrigins = [
  "http://localhost:5173",
  process.env.CLIENT_BASE_URL, // from Render env
].filter(Boolean); // removes undefined/null

app.use(
  cors({
    origin: (origin, callback) => {
      // Allow tools like Postman / server-to-server
      if (!origin) return callback(null, true);

      if (allowedOrigins.includes(origin)) {
        return callback(null, true);
      }

      console.log("Blocked by CORS:", origin); // VERY IMPORTANT for debugging
      return callback(null, false); // do NOT throw error
    },
    credentials: true,
  })
);

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

// Routes path

app.use("/api/users", userRouter);
app.use("/api/videos", videosRouter);

export default app;
