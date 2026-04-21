import * as authService from "../services/auth.service.js";

export const loginUser = async (req, res) => {
  try {
    const { accessToken, refreshToken, user } = await authService.loginUser(
      req.body,
    );

    res.cookie("refreshToken", refreshToken, {
      httpOnly: true,
      secure: false,
      sameSite: "strict",
    });

    res.status(200).json({
      status: true,
      accessToken,
      user,
    });
  } catch (error) {
    res.status(401).json({
      status: false,
      message: error.message,
    });
  }
};

export const refreshToken = async (req, res) => {
  try {
    const token = req.cookies.refreshToken;

    const result = await authService.refreshToken(token);

    res.cookie("refreshToken", result.refreshToken, {
      httpOnly: true,
      secure: false,
      sameSite: "strict",
    });

    res.json({
      accessToken: result.accessToken,
    });
  } catch (err) {
    res.status(401).json({ message: err.message });
  }
};
