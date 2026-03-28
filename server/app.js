import express from "express";
import cookieParser from "cookie-parser";
import cors from "cors";
import dotenv from "dotenv";

// Import Routes
import userRouter from "./routes/user.route.js";
import videosRouter from "./routes/video.route.js";

const app = express();
dotenv.config();

const allowedHosts = ["localhost", "youtube-clone-client-alpha.vercel.app"];

app.use(
  cors({
    origin: (origin, callback) => {
      if (!origin) return callback(null, true);

      try {
        const { hostname } = new URL(origin);

        if (allowedHosts.includes(hostname)) {
          return callback(null, true);
        }

        console.log("Blocked by CORS:", origin);
        return callback(null, false);
      } catch (err) {
        return callback(null, false);
      }
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
