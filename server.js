// ===============================
// LifeSetu Server (Beginner Safe)
// ===============================

const express = require("express");
const fs = require("fs");
const app = express();

// 🔐 ADMIN PASSWORD (change later)
const ADMIN_PASSWORD = "lifesetu123";

// 🧠 Simple admin session flag
let isAdminLoggedIn = false;

app.use(express.urlencoded({ extended: true }));

// ===============================
// USER SIDE
// ===============================

// Homepage
app.get("/", (req, res) => {
  res.sendFile(__dirname + "/index.html");
});

// Handle form submit
app.post("/submit", (req, res) => {
  const data = JSON.parse(fs.readFileSync("requests.json"));

  data.push({
    name: req.body.name,
    phone: req.body.phone,
    service: req.body.service,
    details: req.body.details,
    time: new Date()
  });

  fs.writeFileSync("requests.json", JSON.stringify(data, null, 2));

  res.sendFile(__dirname + "/thankyou.html");
});

// ===============================
// ADMIN LOGIN
// ===============================

// Admin login page OR dashboard
app.get("/admin", (req, res) => {
  if (!isAdminLoggedIn) {
    res.sendFile(__dirname + "/login.html");
  } else {
    res.sendFile(__dirname + "/admin.html");
  }
});

// Handle admin login
app.post("/login", (req, res) => {
  if (req.body.password === ADMIN_PASSWORD) {
    isAdminLoggedIn = true;
    res.redirect("/admin");
  } else {
    res.send("❌ Wrong password");
  }
});

// Logout admin
app.get("/logout", (req, res) => {
  isAdminLoggedIn = false;
  res.redirect("/admin");
});

// ===============================
// ADMIN DATA (PROTECTED)
// ===============================

app.get("/data", (req, res) => {
  if (!isAdminLoggedIn) {
    return res.status(401).send("Unauthorized");
  }
  const data = fs.readFileSync("requests.json");
  res.type("json").send(data);
});

// ===============================
// SERVER START
// ===============================

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log("✅ LifeSetu running on port " + PORT);
});

