import mongoose from "mongoose";
const connection = {};
var colors = require("colors");

async function connectDb() {
  if (connection.isConnected) {
    console.log("Already connected to the database".green.bold);
    return;
  }
  if (mongoose.connections.length > 0) {
    connection.isConnected = mongoose.connections[0].readyState;
    if (connection.isConnected === 1) {
      console.log(
        "Use previous connected to the database".underline.green.bold
      );
      return;
    }
    await mongoose.disconnect();
  }

  const db = await mongoose.connect(process.env.MONGOODB_URL, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  });
  console.log("New connection to the database.".underline.green.bold);
  connection.isConnected = db.connections[0].readyState;
}

async function disconnectDb() {
  if (connection.isConnected) {
    if (process.env.NODE_ENV === "production") {
      await mongoose.disconnect();
      connection.isConnected = false;
    } else {
      console.log("Not Diconnecting from the database.".underline.red);
    }
  }
}

const db = { connectDb, disconnectDb };
export default db;
