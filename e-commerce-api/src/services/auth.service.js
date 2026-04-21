import { withClient } from "../utils/transaction.utils.js";
import * as userRepo from "../repositories/user.repository.js";
import * as authRepo from "../repositories/auth.repository.js";
import { comparePassword } from "../utils/password.util.js";
import {
  generateAccessToken,
  generateRefreshToken,
  verifyRefreshToken,
} from "../utils/jwt.util.js";

export const loginUser = async ({ email, password }) => {
  return withClient(async (client) => {
    const user = await userRepo.findByEmail(client, email);
    if (!user) throw new Error("Invalid credentials");

    const match = await comparePassword(password, user.password);
    if (!match) throw new Error("Invalid credentials");

    const payload = {
      id: user.id,
      email: user.email,
      role_id: user.role_id,
    };

    const accessToken = await generateAccessToken(payload);
    const refreshToken = await generateRefreshToken(payload);

    await authRepo.saveRefreshToken(
      client,
      user.id,
      refreshToken,
      new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
    );

    return { accessToken, refreshToken };
  });
};

export const refreshToken = async (token) => {
  return withClient(async (client) => {
    if (!token) throw new Error("No refresh token");

    // 1. check DB
    const stored = await authRepo.findRefreshToken(client, token);
    if (!stored) throw new Error("Invalid refresh token");

    // 2. verify JWT
    const payload = await verifyRefreshToken(token);

    // 3. delete old token (ROTATION)
    await authRepo.deleteRefreshToken(client, token);

    // 4. create new tokens
    const newPayload = {
      id: payload.id,
      email: payload.email,
      role_id: payload.role_id,
    };

    const accessToken = await generateAccessToken(newPayload);
    const newRefreshToken = await generateRefreshToken(newPayload);

    // 5. store new refresh token
    await authRepo.saveRefreshToken(
      client,
      payload.id,
      newRefreshToken,
      new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
    );

    return { accessToken, refreshToken: newRefreshToken };
  });
};
