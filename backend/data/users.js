const bcrypt = require("bcryptjs");

const user = [
  {
    name: "admin user",
    email: "admin@email.com",
    password: bcrypt.hashSync("123123", 12),
    isAdmin: true,
  },
  {
    name: "user1",
    email: "user1@email.com",
    password: bcrypt.hashSync("123123", 12),
    isAdmin: false,
  },
  {
    name: "user2",
    email: "user2@email.com",
    password: bcrypt.hashSync("123123", 12),
    isAdmin: false,
  },
];

module.exports = user;
