import * as userRepo from "../repositories/user.repository.js";
import { comparePassword } from "../utils/password.util.js";
import {
  generateAccessToken,
  generateRefreshToken,
} from "../utils/jwt.util.js";

export const loginUser = async ({ email, password }) => {
  const user = await userRepo.findByEmail(email);
  if (!user) throw new Error("Invalid credentials");

  const match = await comparePassword(password, user.password);
  if (!match) throw new Error("Invalid credentials");

  const payload = {
    id: user.id,
    email: user.email,
  };

  const accessToken = generateAccessToken(payload);
  const refreshToken = generateRefreshToken(payload);

  return { accessToken, refreshToken };
};
