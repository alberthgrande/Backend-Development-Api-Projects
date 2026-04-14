import * as userRepo from "../repositories/user.repository.js";
import { hashPassword } from "../utils/password.util.js";

export const createUser = async ({ email, password, role_id }) => {
  const existingUser = await userRepo.findByEmail(email);
  if (existingUser) throw new Error("Email already exists");

  const hashedPassword = await hashPassword(password);

  const newUser = await userRepo.createUser({
    email,
    password: hashedPassword,
    role_id,
  });

  return newUser;
};

export const updateUser = async ({ userId, email, password }) => {
  const existingUser = await userRepo.findById(userId);
  if (!existingUser) throw new Error("User not found");

  if (email && email !== existingUser.email) {
    const emailTaken = await userRepo.findByEmail(email);
    if (emailTaken) throw new Error("Email already in use");
  }

  let updatedData = {
    email: email ?? existingUser.email,
    password: existingUser.password,
  };

  if (password) {
    updatedData.password = await hashPassword(password);
  }

  const updatedUser = await userRepo.updateUser(userId, updatedData);

  return updatedUser;
};

export const deleteUser = async (userId) => {
  const existingUser = await userRepo.findById(userId);
  if (!existingUser) throw new Error("User not found");

  const deleted = await userRepo.deleteUser(userId);

  return deleted;
};
