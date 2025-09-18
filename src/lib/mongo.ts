import mongoose from "mongoose";
import dotenv from "dotenv";

dotenv.config();

export async function connectDB() {
  try {
    await mongoose.connect(process.env.MONGODB_URI!, {
      dbName: "miAppReseñas", 
    });
    console.log("✅ Conectado a MongoDB Atlas con Mongoose");
  } catch (err) {
    console.error("❌ Error de conexión:", err);
    process.exit(1);
  }
}
