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

export const updatedUser = async (req, res) => {
  try {
    const user = await userService.updateUser({
      userId: req.params.id,
      ...req.body,
    });

    res.status(201).json({
      status: true,
      data: user,
      message: "User updated successfully",
    });
  } catch (error) {
    res.status(400).json({
      status: false,
      error: error.message,
    });
  }
};

export const deleteUser = async (req, res) => {
  try {
    await userService.deleteUser(req.params.id);

    res.status(201).json({
      status: true,
      message: "User deleted successfully",
    });
  } catch (error) {
    res.status(400).json({
      status: false,
      error: error.message,
    });
  }
};
