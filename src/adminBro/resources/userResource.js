const userResource = {
  properties: {
    encryptedPassword: {
      isVisible: false,
    },
    password: {
      type: "password",
      isVisible: {
        show: false,
        edit: false,
        list: false,
        filter: false,
      },
    },
  },
};

module.exports = userResource;
