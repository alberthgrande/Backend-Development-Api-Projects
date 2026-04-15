import { withTransaction } from "../utils/transaction.utils.js";
import * as userRepo from "../repositories/user.repository.js";
import { hashPassword } from "../utils/password.util.js";

// CREATE
export const createUser = ({ email, password, role_id }) =>
  withTransaction(async (client) => {
    const existingUser = await userRepo.findByEmail(client, email);
    if (existingUser) throw new Error("Email already exists");

    const hashedPassword = await hashPassword(password);

    return userRepo.createUser(client, {
      email,
      password: hashedPassword,
      role_id,
    });
  });

// UPDATE
export const updateUser = ({ userId, email, password }) =>
  withTransaction(async (client) => {
    const existingUser = await userRepo.findById(client, userId);
    if (!existingUser) throw new Error("User not found");

    if (email && email !== existingUser.email) {
      const emailTaken = await userRepo.findByEmail(client, email);
      if (emailTaken) throw new Error("Email already in use");
    }

    const updatedData = {
      email: email ?? existingUser.email,
      password: existingUser.password,
    };

    if (password) {
      updatedData.password = await hashPassword(password);
    }

    return userRepo.updateUser(client, userId, updatedData);
  });

// DELETE
export const deleteUser = (userId) =>
  withTransaction(async (client) => {
    const existingUser = await userRepo.findById(client, userId);
    if (!existingUser) throw new Error("User not found");

    return userRepo.deleteUser(client, { userId });
  });
