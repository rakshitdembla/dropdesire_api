import mongoose from "mongoose";

const connectMongo = async () => {
  try {
    await mongoose.connect(process.env.MONGOOSE_CONNECTION, {
      dbName: "dropdesire",
    });

    console.log("DB Connection Successfull.");
  } catch (e) {
    console.log("Error in DB connection", e);
    process.exit(1);
  }
};

export default connectMongo;
