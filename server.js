const express = require("express");

const app = express();
app.use(express.json());

console.log("🔥 CLEAN SERVER STARTED");

app.post("/test", (req, res) => {
  console.log("🔥 TEST HIT");
  res.json({ message: "POST working" });
});

app.listen(3001, () => {
  console.log("🚀 Server running on http://localhost:3001");
});