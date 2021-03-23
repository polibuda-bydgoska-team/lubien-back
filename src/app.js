const path = require("path");

const express = require("express");
const cors = require("cors");
require("./db/db-connection");
const bcrypt = require("bcryptjs");
require("dotenv").config({ path: path.resolve(__dirname, "../.env") });
const uri = process.env.ATLAS_URI;
const session = require("express-session");
const MongoStore = require("connect-mongo");

const Admin = require("./models/admin");
const AdminBro = require("admin-bro");
const AdminBroExpress = require("@admin-bro/express");
const AdminBroMongoose = require("@admin-bro/mongoose");
AdminBro.registerAdapter(AdminBroMongoose);
const adminBro = require("./adminBro");

const router = AdminBroExpress.buildAuthenticatedRouter(adminBro, {
  authenticate: async (email, password) => {
    const admin = await Admin.findOne({ email });
    if (admin) {
      const matched = await bcrypt.compare(password, admin.encryptedPassword);
      if (matched) {
        return admin;
      }
    }
    return false;
  },
  cookiePassword: "some-secret-password-used-to-secure-cookie",
});

const authRouter = require("./routers/auth");
const shopRouter = require("./routers/shop");
const userRouter = require("./routers/user");
const notFoundRouter = require("./routers/404");
const errorHandler = require("./middleware/errorHandler");

const app = express();
const PORT = process.env.PORT || 3001;

app.use(adminBro.options.rootPath, router);

app.use(
  session({
    secret: "some-secret-password-used-to-secure-cookie",
    store: MongoStore.create({ mongoUrl: uri }),
    resave: false,
    saveUninitialized: true,
  })
);

app.use(cors());
app.use(express.json());
app.use("/auth", authRouter);
app.use("/shop", shopRouter);
app.use("/user", userRouter);
app.use(notFoundRouter);
app.use(errorHandler);

app.listen(PORT, () => {
  console.log("Server is running on " + PORT);
});
