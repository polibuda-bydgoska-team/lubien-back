const express = require("express");
const cors = require("cors");
require("./db/db-connection");
//const path = require("path");

const authRouter = require("./routers/auth");
const adminRouter = require("./routers/admin");
const shopRouter = require("./routers/shop");
const userRouter = require("./routers/user");
const notFoundRouter = require("./routers/404");
const errorHandler = require("./middleware/errorHandler");
//const imagesUploader = require("./middleware/imagesUploader");

const app = express();
const PORT = process.env.PORT || 3001;

app.use(cors());
app.use(express.json());
// // app.use(imagesUploader);
// app.use("/images", express.static(path.join(__dirname, "images")));
app.use("/auth", authRouter);
app.use("/admin", adminRouter);
app.use("/shop", shopRouter);
app.use("/user", userRouter);
app.use(notFoundRouter);
app.use(errorHandler);

app.listen(PORT, () => {
  console.log("Server is running on " + PORT);
});
