const mongoose = require("mongoose");
const path = require("path");
require("dotenv").config({ path: path.resolve(__dirname, "../../.env") });

const uri = process.env.ATLAS_URI;

try {
  mongoose.connect(
    uri,
    {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      useCreateIndex: true,
      useFindAndModify: false,
    },
    () => console.log("Connected to database")
  );
} catch (error) {
  console.log("Could not connect to database: " + error.message);
}
