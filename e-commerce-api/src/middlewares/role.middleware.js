export const requireAdmin = (req, res, next) => {
  if (req.user.role !== "admin") {
    // Check if role name is admin
    return res.status(403).json({
      status: false,
      message: "Forbidden: Admin only",
    });
  }

  next();
};
