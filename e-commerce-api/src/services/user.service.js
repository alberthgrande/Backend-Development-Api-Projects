import * as userRepo from "../repositories/user.repository.js";
import { hashPassword } from "../utils/password.util.js";

export const createUser = async ({ email, password }) => {
  const existingUser = await userRepo.findByEmail(email);
  if (existingUser) throw new Error("Email already exists");

  const hashedPassword = await hashPassword(password);

  const newUser = await userRepo.createUser({
    email,
    password: hashedPassword,
  });

  return newUser;
};
