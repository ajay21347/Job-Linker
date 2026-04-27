import jwt from "jsonwebtoken";

export const protect = (req, res, next) => {
  console.log("🔥 Middleware hit"); // ADD THIS

  const token = req.headers.authorization?.split(" ")[1];
  console.log("TOKEN:", token);
  if (!token) {
    return res.status(401).json({ success: false, message: "Not authorized" });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    console.log("DECODED:", decoded);

    req.user = decoded;
    next();
  } catch (error) {
    console.log("JWT ERROR:", error.message);

    return res.status(401).json({ success: false, message: "Invalid token" });
  }
};
