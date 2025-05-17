const express = require("express");
const cors = require("cors");
const authRoutes = require("./authRoutes");
const serviceRoutes = require("./serviceRoutes");

const app = express();
app.use(cors());
app.use(express.json());

app.use("/auth", authRoutes);
app.use("/api", serviceRoutes);

app.listen(5000, () => console.log("Server running on port 5000"));
