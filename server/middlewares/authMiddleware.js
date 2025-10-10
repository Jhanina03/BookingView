import User from "../models/User.js";
import { clerkClient } from "@clerk/clerk-sdk-node";

export const protect = async (req, res, next) => {
  try {
    const { userId } = req.auth();
    if (!userId) {
      return res.status(401).json({ success: false, message: "Not authenticated" });
    }

    let user = await User.findById(userId);

    if (!user) {
      // Buscar usuario en Clerk
      const clerkUser = await clerkClient.users.getUser(userId);

      // Si el usuario existe en Clerk pero no en tu DB, lo creas solo si es nuevo
      if (!clerkUser.deleted) {
        user = await User.create({
          _id: userId,
          username: clerkUser.username || "User",
          email: clerkUser.emailAddresses[0]?.emailAddress || `user-${userId}@example.com`,
          image: clerkUser.profileImageUrl || "",
          role: "user",
          recentSearchedCities: [],
          isActive: true,
        });
        console.log(`✅ Usuario creado en DB: ${user.email}`);
      } else {
        // Si está marcado como eliminado/inactivo en Clerk, no lo crees
        return res.status(403).json({
          success: false,
          message: "Tu cuenta está inactiva. ¿Deseas reactivarla?",
        });
      }
    }

    // Verificar si está inactivo
    if (!user.isActive) {
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
