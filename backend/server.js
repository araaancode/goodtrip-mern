// load env vars
require("dotenv").config({ path: __dirname + "/.env" });

// ext libs
const express = require("express");
const colors = require("colors");
const path = require("path");
const cookieParser = require("cookie-parser");
const cors = require("cors");
const morgan = require("morgan");

// app init
const app = express();

// internal libs
const { notFound, errorHandler } = require("./middlewares/errorMiddleware");
const mongoErrorMiddleware = require("./middlewares/mongoError");

// connect to database
const connection = require("./config/db");
connection();

// routes
const userAuthRoutes = require("./routes/users/auth");
const userRoutes = require("./routes/users/users");

const adminAuthRoutes = require("./routes/admins/auth");
const adminRoutes = require("./routes/admins/admins");

// const adminUserRoutes = require("./routes/admins/users")
// const adminDriverRoutes = require("./routes/admins/drivers")
// const adminOwnerRoutes = require("./routes/admins/owners")
// const adminCookRoutes = require("./routes/admins/cooks")
// const adminHouseRoutes = require("./routes/admins/houses")
// const adminHouseReservationRoutes = require("./routes/admins/houseReservations")
// const adminBusRoutes = require("./routes/admins/buses")
// const adminBusesTicketRoutes = require("./routes/admins/busTickets")
// const adminSupportTicketRoutes = require("./routes/admins/supportTickets")

const driverAuthRoutes = require("./routes/drivers/auth");
const driverRoutes = require("./routes/drivers/drivers");

const ownerAuthRoutes = require("./routes/owners/auth");
const ownerRoutes = require("./routes/owners/owners");

const cookAuthRoutes = require("./routes/cooks/auth");
const cookRoutes = require("./routes/cooks/cooks");

// middlewares
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

app.use(
  cors({
    origin: true,
    credentials: true,
  })
);

app.use(cookieParser());

// set node env
if (process.env.NODE_ENV === "development") {
  app.use(morgan("dev"));
}

app.use("/uploads", express.static(path.join(__dirname, "/uploads")));

if (process.env.NODE_ENV === "production") {
  app.use(express.static(path.join(__dirname, "/frontend/build")));

  app.get("*", (req, res) =>
    res.sendFile(path.resolve(__dirname, "frontend", "build", "index.html"))
  );
} else {
  app.get("/", (req, res) => {
    res.send("API is running....");
  });
}

// mount routes

// *** users endpoints ***
app.use("/api/users/auth", userAuthRoutes);
app.use("/api/users", userRoutes);

// *** admins endpoints ***
app.use("/api/admins/auth", adminAuthRoutes);
app.use("/api/admins", adminRoutes);

// *** drivers endpoints ***
app.use("/api/drivers/auth", driverAuthRoutes);
app.use("/api/drivers", driverRoutes);

// *** owners endpoints ***
app.use("/api/owners/auth", ownerAuthRoutes);
app.use("/api/owners", ownerRoutes);

app.use("/api/cooks/auth", cookAuthRoutes);
app.use("/api/cooks", cookRoutes);

// error middlewares
// app.use(notFound)
app.use(errorHandler);
app.use(mongoErrorMiddleware);

// server setup
const PORT = process.env.PORT || 5000;

process.on("uncaughtException", (err) => {
  console.log("UNCAUGHT EXCEPTION! 💥 Shutting down...");
  console.log(err.name, err.message);
  process.exit(1);
});

const server = app.listen(PORT, () => {
  console.log(`App running on port ${PORT}...`);
});

process.on("unhandledRejection", (err) => {
  console.log("UNHANDLED REJECTION! 💥 Shutting down...");
  console.log(err.name, err.message);
  server.close(() => {
    process.exit(1);
  });
});

process.on("SIGTERM", () => {
  console.log("👋 SIGTERM RECEIVED. Shutting down gracefully");
  server.close(() => {
    console.log("💥 Process terminated!");
  });
});
