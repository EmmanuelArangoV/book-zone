import { connectDB } from "@/lib/mongodb";
import User from "@/models/User";

export async function getUserByEmail(email: string) {
    await connectDB();
    return User.findOne({ email });
}

export async function createUser(name: string, email: string, hashedPassword: string) {
    await connectDB();
    return User.create({ name, email, password: hashedPassword });
}

export async function getUserById(id: string) {
  await connectDB();
  return User.findById(id);
}