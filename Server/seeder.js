import mongoose from "mongoose";
import dotenv from "dotenv";
import Product from "./models/Product.js";
import User from "./models/users.js";
import Cart from "./models/Cart.js";
import Products from "./data/products.js";

dotenv.config();

const seedData = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });

    await Product.deleteMany();
    await User.deleteMany();
    await Cart.deleteMany();

    const createUser = await User.create({
      name: "Admin",
      email: "admin@gmail.com",
      password: "123456",
      role: "admin",
    });

    const userId = createUser._id;

    const sampleProducts = Products.map((product) => ({
      ...product,
      user: userId,
    }));

    await Product.insertMany(sampleProducts);

    console.log("✅ Product data seeded successfully");
    process.exit(0);
  } catch (error) {
    console.error("❌ Error seeding data:", error);
    process.exit(1);
  }
};

seedData();