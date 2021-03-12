const express = require("express");
const cors = require("cors");
require("./db/db-connection");
const path = require("path");

const adminRouter = require("./routers/admin");
const notFoundRouter = require("./routers/404");
const errorHandler = require("./middleware/errorHandler");
const imagesUploader = require("./middleware/imagesUploader");

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());
// // app.use(imagesUploader);
// app.use("/images", express.static(path.join(__dirname, "images")));
app.use("/admin", adminRouter);
app.use(notFoundRouter);
app.use(errorHandler);

app.listen(PORT, () => {
  console.log("Server is running on " + PORT);
});
