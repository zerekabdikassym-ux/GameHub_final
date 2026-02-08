require("dotenv").config();
const path = require("path");
const express = require("express");
const cors = require("cors");
const morgan = require("morgan");

const connectDB = require("./src/config/db");
const { notFound, errorHandler } = require("./src/middleware/errorMiddleware");

const authRoutes = require("./src/routes/authRoutes");
const userRoutes = require("./src/routes/userRoutes");
const resourceRoutes = require("./src/routes/resourceRoutes");
const externalRoutes = require("./src/routes/externalRoutes");

const app = express();

app.use(cors());
app.use(express.json());
app.use(morgan("dev"));

app.use("/api/auth", authRoutes);
app.use("/api/users", userRoutes);
app.use("/api/resource", resourceRoutes);
app.use("/api/external", externalRoutes);

const frontendRoot = path.join(__dirname, ".."); 
app.use(express.static(frontendRoot));

app.get("/", (req, res) => {
  res.sendFile(path.join(frontendRoot, "index.html"));
});

app.use(notFound);
app.use(errorHandler);

let PORT = process.env.PORT || 5000;

(async () => {
  await connectDB(process.env.MONGO_URI);

  const server = app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });

  server.on('error', (err) => {
    if (err.code === 'EADDRINUSE') {
      console.warn(`Port ${PORT} is already in use, trying port ${PORT + 1}...`);
      PORT = PORT + 1;
      const retryServer = app.listen(PORT, () => {
        console.log(`Server running on http://localhost:${PORT}`);
      });
      retryServer.on('error', (retryErr) => {
        console.error('Failed to start server on alternate port:', retryErr.message);
        process.exit(1);
      });
    } else {
      console.error('Server error:', err);
      process.exit(1);
    }
  });
})();
