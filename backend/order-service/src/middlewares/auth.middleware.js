export const infoUser = (req, res, next) => {
  const email = req.get("X-User-Email") || "huynhhoangitf1207@gmail.com";
  const role = req.get("X-User-Role") || "USER";
  const jti = req.get("X-Jti") || "default-jti";

  const authHeader = req.get("Authorization");
  // console.log("Auth Header:", authHeader);
  if (authHeader && authHeader.startsWith("Bearer ")) {
    const token = authHeader.substring(7, authHeader.length);
    req.token = token;
  }

  if (email) {
    req.user = {
      email: email,
      role: role,
      authorities: ["ROLE_" + role],
      jti: jti,
    };
  }

  console.log("User Info:", req.token);

  next();
};
