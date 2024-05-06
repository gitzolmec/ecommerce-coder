function adminAuthMiddleware(req, res, next) {
  const role = req.user.role;

  if (role === "admin" || role === "premium") {
    return next();
  }
  res.redirect("/api/error-401");
}

export { adminAuthMiddleware };
