import User from "../models/User.js";
import { clerkClient } from "@clerk/clerk-sdk-node";

// Middleware para proteger rutas
export const protect = async (req, res, next) => {
  try {
    // Obtener userId de Clerk
    const { userId } = req.auth();
    if (!userId) {
      return res.status(401).json({ success: false, message: "Not authenticated" });
    }

    // Buscar usuario por _id
    let user = await User.findById(userId);

    if (!user) {
      // Obtener datos de Clerk
      const clerkUser = await clerkClient.users.getUser(userId);

      // Buscar si ya existe por email para evitar duplicados
      const existingUser = await User.findOne({ email: clerkUser.emailAddresses[0]?.emailAddress });

      if (existingUser) {
        user = existingUser; // Usar usuario existente
      } else {
        // Crear usuario solo si no existe
        user = await User.create({
          _id: userId,
          username: clerkUser.username || `${clerkUser.firstName || ""} ${clerkUser.lastName || ""}`.trim() || "User",
          email: clerkUser.emailAddresses[0]?.emailAddress || `user-${userId}@example.com`,
          image: clerkUser.profileImageUrl || "",
          role: "user",
          recentSearchedCities: [],
          isActive: true,
        });
        console.log(`✅ Usuario creado en DB: ${user.email}`);
      }
    }

    // Bloquear usuarios inactivos
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
