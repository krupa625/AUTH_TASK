const { port } = require("./src/configure/config");
const express = require("express");
const route = require("./src/routes/index");
const { errorHandler } = require("./src/utils/error");

const app = express();

app.use(express.json());

console.log("Starting server...");

app.use("/healthcheck", (req, res) => {
  res.send("server is Running.......");
});
app.use(errorHandler);
app.use("/api", route);
app.use("/public", express.static("public"));

app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});
