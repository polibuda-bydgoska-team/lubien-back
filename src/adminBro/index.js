const AdminBro = require("admin-bro");
const bcrypt = require("bcryptjs");

const Admin = require("../models/admin");
const User = require("../models/user");
const Product = require("../models/product");
const Order = require("../models/order");
const userResource = require("./resources/userResource");

const sidebarGroups = {
  user: {
    name: "Users Management",
    icon: "User",
  },
  product: {
    name: "Products Management",
    icon: "Product",
  },
  order: {
    name: "Orders Management",
    icon: "Order",
  },
  admin: {
    name: "Admin Users Managment",
    icon: "Admin",
  },
};

const adminBro = new AdminBro({
  resources: [
    {
      resource: User,
      options: {
        ...userResource,
        parent: sidebarGroups.user,
      },
    },
    {
      resource: Product,
      options: {
        parent: sidebarGroups.product,
      },
    },
    {
      resource: Order,
      options: {
        parent: sidebarGroups.order,
      },
    },
    {
      resource: Admin,
      options: {
        parent: sidebarGroups.admin,
        properties: {
          encryptedPassword: {
            isVisible: false,
          },
          password: {
            type: "string",
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
            before: async (request) => {
              if (request.payload.password) {
                request.payload = {
                  ...request.payload,
                  encryptedPassword: await bcrypt.hash(
                    request.payload.password,
                    12
                  ),
                  password: undefined,
                };
              }
              return request;
            },
          },
        },
      },
    },
  ],
  rootPath: "/admin",
  loginPath: "/admin/login",
  branding: {
    companyName: "Lubien",
    softwareBrothers: false,
    logo: false,
  },
});

module.exports = adminBro;
