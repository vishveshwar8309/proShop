const mongoose = require("mongoose");

const mongoDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGO_URI);
    console.log(`MongoDB connected: ${conn.connection.host}`);
  } catch (err) {
    console.log(`Error; ${err}`);
    process.exit(1);
  }
};

module.exports = mongoDB;
