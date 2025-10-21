import mongoose from 'mongoose';

export const connect = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URL);
    console.log("Connect successful");
  } catch (error) {
    console.log("Connect error: ", error.message);
  }
};
