import * as userService from "../services/user.service.js";

export const createUser = async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await userService.createUser({ email, password });

    res.status(201).json({
      status: true,
      data: user,
      message: "User created successfully",
    });
  } catch (error) {
    res.status(400).json({
      status: false,
      error: error.message,
    });
  }
};
