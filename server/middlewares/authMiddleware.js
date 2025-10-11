import { getAuth } from "@clerk/express";
import User from "../models/User.js";

export const protect = async (req, res, next) => {
  try {
    const { userId } = getAuth(req);

    if (!userId) return res.status(401).json({ success: false, message: "No autorizado" });

    let user = await User.findById(userId);

    if (!user) {
      // No crees el usuario automáticamente aquí
      return res.status(403).json({ success: false, message: "Usuario no registrado o inactivo" });
    }

    if (!user.isActive) {
      return res.status(403).json({ success: false, message: "Tu cuenta está inactiva" });
    }

    req.user = user;
    next();
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: "Error en autenticación" });
  }
};
