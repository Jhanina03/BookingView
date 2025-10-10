import userModel from "../models/User.js";

export const getUserData = async (req, res) => {
  try {
    const role = req.user.role;
    const recentSearchedCities = req.user.recentSearchedCities;
    res.json({ success: true, role, recentSearchedCities });
  } catch (error) {
    res.json({ success: false, message: error.message });
  }
};

export const storeRecentSearchedCities = async (req, res) => {
  try {
    const { recentSearchedCity } = req.body;
    const user = await req.user;

    if (user.recentSearchedCities.length < 3) {
      user.recentSearchedCities.push(recentSearchedCity);
    } else {
      user.recentSearchedCities.shift();
      user.recentSearchedCities.push(recentSearchedCity);
    }
    await user.save();
    res.json({ success: true, message: "City added" });
  } catch (error) {
    res.json({ success: false, message: error.message });
  }
};

export const forceSyncUsers = async (req, res) => {
  try {
    console.log("🔄 Iniciando sincronización de usuarios con Clerk...");

    // obtener lista de usuarios activos en Clerk
    const clerkUsers = await clerkClient.users.getUserList();
    const clerkIds = clerkUsers.map(u => u.id);

    // eliminar los que ya no existen en Clerk
    const deleted = await userModel.deleteMany({ _id: { $nin: clerkIds } });

    console.log(`🗑️ Usuarios eliminados por sincronización: ${deleted.deletedCount}`);
    res.json({ success: true, message: "Sincronización completada", deleted: deleted.deletedCount });
  } catch (error) {
    console.error("🔥 Error en sincronización:", error);
    res.status(500).json({ success: false, message: error.message });
  }
};