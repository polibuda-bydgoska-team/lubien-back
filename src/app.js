const express = require("express");
const cors = require("cors");
require("./db/db-connection");

const adminRoutes = require("./routes/admin");

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());
app.use("/admin", adminRoutes);

app.listen(PORT, () => {
  console.log("Server is running on " + PORT);
});
