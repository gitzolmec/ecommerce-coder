const adminValidation = (role) => {
  let adminValidation = "";
  if (role === "admin") {
    adminValidation = "admin";
  } else if (role === "premium") {
    adminValidation = "premium";
  } else {
    adminValidation = "user";
  }

  return adminValidation;
};

module.exports = adminValidation;
