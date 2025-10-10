import User from "../models/User.js";
import { clerkClient } from "@clerk/clerk-sdk-node";

/**
 * Middleware de protección de rutas.
 * @param {boolean} allowInactive - si true permite pasar usuarios inactivos (solo para reactivación)
 */
export const protect = (allowInactive = false) => async (req, res, next) => {
  try {
    const { userId } = req.auth(); // Clerk añade userId en req.auth()
    if (!userId) {
      return res.status(401).json({ success: false, message: "Not authenticated" });
    }

    let user = await User.findById(userId);

    if (!user) {
      // Traer datos de Clerk
      const clerkUser = await clerkClient.users.getUser(userId);

      // Revisar si ya existe el email
      const emailExists = await User.findOne({ email: clerkUser.emailAddresses[0]?.emailAddress });
      if (emailExists) {
        user = emailExists;
      } else {
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
    }

    // Validar si usuario activo
    if (!user.isActive && !allowInactive) {
      return res.status(403).json({
        success: false,
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
