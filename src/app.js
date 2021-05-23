const path = require("path");

const express = require("express");
const cors = require("cors");
const helmet = require("helmet");
require("./db/db-connection");
const bcrypt = require("bcryptjs");
const { limiter } = require("./config/rateLimits");
require("dotenv").config({ path: path.resolve(__dirname, "../.env") });
const MongoStore = require("connect-mongo");

const Admin = require("./models/admin");
const AdminBro = require("admin-bro");
const AdminBroExpress = require("@admin-bro/express");
const AdminBroMongoose = require("@admin-bro/mongoose");
AdminBro.registerAdapter(AdminBroMongoose);
const adminBro = require("./adminBro");

const routerAdminBro = AdminBroExpress.buildAuthenticatedRouter(
  adminBro,
  {
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
    cookiePassword: process.env.COOKIE_PASSWORD,
  },
  null,
  {
    resave: false,
    saveUninitialized: true,
    store: MongoStore.create({
      mongoUrl: process.env.ATLAS_URI,
      ttl: 1 * 9 * 60 * 60,
    }),
  }
);

const authRouter = require("./routers/auth");
const shopRouter = require("./routers/shop");
const userRouter = require("./routers/user");
const notFoundRouter = require("./routers/404");
const errorHandler = require("./middleware/errorHandler");

const app = express();
const PORT = process.env.PORT || 3001;

app.use(adminBro.options.rootPath, routerAdminBro);
app.use((req, res, next) => {
  if (req.originalUrl.startsWith("/shop/webhook")) {
    next();
  } else {
    express.json()(req, res, next);
  }
});
app.set("trust proxy", 1);
app.use(helmet());
app.use(cors());
app.use(limiter);
app.use("/auth", authRouter);
app.use("/shop", shopRouter);
app.use("/user", userRouter);
app.use(notFoundRouter);
app.use(errorHandler);

app.listen(PORT, () => {
  console.log("Server is running on " + PORT);
});
