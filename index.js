import express from "express";
import mongoose from "mongoose";
import dotenv from "dotenv";
import authRoutes from "./routes/auth.js";
import userRoutes from "./routes/users.js";
import postsRoutes from "./routes/posts.js";
import { verifyToken } from "./verifyToken.js";
import cookieParser from "cookie-parser";

dotenv.config();

const app = express();
const port = process.env.PORT || 3000;
app.use(cookieParser());
app.use(express.json());
mongoose.set("strictQuery", true);

const connect = () => {
  mongoose
    .connect(process.env.MONGO)
    .then(() => {
      console.log("Connected to MongoDB");
    })
    .catch((err) => {
      throw err;
    });
};

app.get("/", verifyToken, (req, res) => {
  res.send("Hello World!");
});

app.use("/api", authRoutes);
app.use("/api", userRoutes);
app.use("/api", postsRoutes);

app.use((err, req, res, next) => {
  const status = err.status || 500;
  const message = err.message || "Something went wrong";
  return res.status(status).json({
    success: false,
    status: status,
    message: message,
  });
});

app.listen(port, () => {
  connect();
  console.log(`Server listening on port : ${port}`);
});

export default app;
