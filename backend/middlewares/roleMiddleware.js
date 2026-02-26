exports.allowRoles = (...roles) => {
  return (req, res, next) => {
    const role=req.user?.role||req.userRole; // 👈 support both req.user.role and req.userRole
    if (!req.userRole || !roles.includes(req.userRole)) {
      return res.status(403).json({
        message: "Access denied",
      });
    }
    next();
  };
};