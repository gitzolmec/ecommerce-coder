function adminAuthMiddleware(req, res, next) {
  const role = req.user.role;

  if (role === "admin" || role === "premium") {
    console.log(role);
    return next();
  }
  res.redirect("/api/error-401");
}

module.exports = adminAuthMiddleware;
