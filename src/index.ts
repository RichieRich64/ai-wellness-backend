import express from "express";
import { Router, Request, Response } from "express";
import dotenv from "dotenv";
import cors from "cors";
import session from "express-session";
import passport from "passport";
import "./config/passport";
import authRoutes from "./routes/auth";
import calendarRoutes from "./routes/calendar";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5001;

// Middlewares
app.use(
  cors({
    origin: process.env.FRONTEND_URL,
    credentials: true,
  })
);

app.use(express.json());

app.use(
  session({
    secret: process.env.SESSION_SECRET!,
    resave: false,
    saveUninitialized: false,
    cookie: {
      secure: false,
      httpOnly: true,
      sameSite: "lax", // or "none" if you’re using HTTPS
    },
  })
);

app.use(passport.initialize());
app.use(passport.session());

app.get("/health", async (req: Request, res: Response) => {
  res.send({ message: "health OK!" });
});

// Routes
app.use("/auth", authRoutes);
app.use("/calendar", calendarRoutes);

app.get("/me", (req, res) => {
  if (!req.user) return res.status(401).send("Not logged in");
  res.send(req.user);
});

app.listen(PORT, () =>
  console.log(`Backend running on http://localhost:${PORT}`)
);
