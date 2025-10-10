import User from "../models/User.js";
import { clerkClient } from "@clerk/clerk-sdk-node";

// console.log("CLERK_SECRET_KEY:", process.env.CLERK_SECRET_KEY);
export const protect = async (req, res, next) => {
  try {
    const { userId } = req.auth();
    if (!userId) {
      return res.status(401).json({ success: false, message: "Not authenticated" });
    }

    let user = await User.findById(userId);

    if (!user) {
      const clerkUser = await clerkClient.users.getUser(userId);

      user = await User.create({
        _id: userId,
        username: clerkUser.username || "User",
        email: clerkUser.emailAddresses[0]?.emailAddress || `user-${userId}@example.com`,
        image: clerkUser.profileImageUrl || "",
        role: "user",
        recentSearchedCities: [],
        isActive: true,
      });
    }

    if (!user.isActive) {
      // Usuario inactivo -> enviar señal especial
      return res.status(403).json({
        success: false,
        inactive: true,
        message: "Tu cuenta está inactiva. ¿Deseas reactivarla?",
      });
    }

    req.user = user;
    next();
  } catch (error) {
    console.error("🔥 Error en middleware protect:", error);
    res.status(500).json({ success: false, message: error.message });
  }
};
