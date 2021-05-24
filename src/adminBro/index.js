const AdminBro = require("admin-bro");
const Admin = require("../models/admin");
const User = require("../models/user");
const Product = require("../models/product");
const Order = require("../models/order");
const userResource = require("./resources/userResource");
const orderResource = require("./resources/orderResource");
const { after, before } = require("./actions/passwordActions");

const sidebarGroups = {
  user: {
    name: "Users Management",
    icon: "User",
  },
  product: {
    icon: "Product",
  },
  order: {
    icon: "Product",
  },
};

const adminBro = new AdminBro({
  resources: [
    {
      resource: User,
      options: {
        ...userResource,
        navigation: sidebarGroups.user,
        sort: {
          sortBy: "isVerified",
          direction: "desc",
        },
      },
    },
    {
      resource: Product,
      options: {
        navigation: sidebarGroups.product,
      },
    },
    {
      resource: Order,
      options: {
        ...orderResource,
        navigation: sidebarGroups.order,
        sort: {
          sortBy: "createdAt",
          direction: "desc",
        },
      },
    },
    {
      resource: Admin,
      options: {
        navigation: sidebarGroups.user,
        properties: {
          encryptedPassword: {
            isVisible: false,
          },
          password: {
            type: "password",
            isVisible: {
              list: false,
              edit: true,
              filter: false,
              show: false,
            },
          },
        },
        actions: {
          new: {
            after: after,
            before: before,
          },
          edit: { after: after, before: before },
        },
      },
    },
  ],
  rootPath: "/admin",
  loginPath: "/admin/login",
  branding: {
    companyName: "Lubien",
    softwareBrothers: false,
    logo: "https://ik.imagekit.io/lubien/Branding/logo_kcjziZXCCPD.png",
    favicon: "https://ik.imagekit.io/lubien/Branding/logo_white_XwISseNAp.png",
  },
  dashboard: {
    component: AdminBro.bundle("./components/dashboard.jsx"),
  },
});

module.exports = adminBro;
