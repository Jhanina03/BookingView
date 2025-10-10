import userModel from "../models/User.js";
import { clerkClient } from "@clerk/clerk-sdk-node";

export const syncUsers = async () => {
  console.log("🔄 Iniciando sincronización de usuarios con Clerk...");

  const clerkUsers = await clerkClient.users.getUserList();
  const clerkIds = clerkUsers.map(u => u.id);

  const deleted = await userModel.deleteMany({ _id: { $nin: clerkIds } });
  console.log(`🗑️ Usuarios eliminados por sincronización: ${deleted.deletedCount}`);

  return deleted.deletedCount;
};


export const forceSyncUsers = async (req, res) => {
  try {
    const deletedCount = await syncUsers();
    res.json({ success: true, message: "Sincronización completada", deleted: deletedCount });
  } catch (error) {
    console.error("🔥 Error en sincronización:", error);
    res.status(500).json({ success: false, message: error.message });
  }
};

export const reactivateUser = async (req, res) => {
  try {
    const user = req.user;
    user.isActive = true;

    // const hotels = await Hotel.find({ owner: user._id });
    // for (const hotel of hotels) {
    //   await Room.updateMany({ hotel: hotel._id }, { $set: { isAvailable: true } });
    // }

    await user.save();

    res.json({ success: true, message: "Cuenta reactivada correctamente" });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

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
