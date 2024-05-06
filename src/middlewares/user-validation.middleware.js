function userAuthMiddleware(req, res, next) {
  const role = req.user.role;

  if (role === "user" || role === "premium") {
    return next();
  }
  res.redirect("/api/error-401");
}

export { userAuthMiddleware };
