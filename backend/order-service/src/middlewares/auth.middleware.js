export const infoUser = (req, res, next) => {
  const email = req.get("X-User-Email") || "huynhhoangitf1207@gmail.com";
  const role = req.get("X-User-Role") || "USER";
  const jti = req.get("X-Jti") || "default-jti";

  if (email) {
    req.user = {
      email: email,
      role: role,
      authorities: ["ROLE_" + role],
      jti: jti,
    };
  }

  next();
};
