import { Webhook } from "svix";
import User from "../models/User.js";
import Hotel from "../models/Hotel.js";
import Room from "../models/Room.js";

const clerkWebhooks = async (req, res) => {
  try {
    const whook = new Webhook(process.env.CLERK_WEBHOOK_SECRET);

    const headers = {
      "svix-id": req.headers["svix-id"],
      "svix-timestamp": req.headers["svix-timestamp"],
      "svix-signature": req.headers["svix-signature"],
    };

    const payload = req.body.toString("utf8"); // importante
    await whook.verify(payload, headers);

    const { data, type } = JSON.parse(payload);

    console.log("🔔 Webhook recibido:", type, data.id);

    switch (type) {
      case "user.created": {
        const userData = {
          _id: data.id,
          email: data.email_addresses[0]?.email_address || "",
          username: `${data.first_name || ""} ${data.last_name || ""}`.trim(),
          image: data.image_url || "",
          role: "user",
          recentSearchedCities: [],
        };
        await User.create(userData);
        console.log(`✅ Usuario creado en DB: ${userData.email}`);
        break;
      }

      case "user.updated": {
        const userData = {
          email: data.email_addresses[0]?.email_address || "",
          username: `${data.first_name || ""} ${data.last_name || ""}`.trim(),
          image: data.image_url || "",
        };
        const updatedUser = await User.findByIdAndUpdate(data.id, userData, { new: true });
        console.log(`🟡 Usuario actualizado en DB: ${updatedUser?._id}`);
        break;
      }

      case "user.deleted": {
        console.log("🔴 Webhook user.deleted recibido para userId:", data.id);

        const deletedUser = await User.findOneAndDelete({ _id: data.id });
        console.log("Usuario eliminado:", deletedUser ? deletedUser._id : "No encontrado");

        const hotels = await Hotel.find({ owner: data.id });
        console.log("Hoteles encontrados:", hotels.length);

        for (const hotel of hotels) {
          const result = await Room.updateMany(
            { hotel: hotel._id },
            { $set: { isAvailable: false } }
          );
          console.log(`Habitaciones del hotel ${hotel._id} actualizadas:`, result.modifiedCount);
        }

        break;
      }

      default:
        console.log(`⚪ Evento no manejado: ${type}`);
        break;
    }

    res.json({ success: true, message: "Webhook Received" });
  } catch (error) {
    console.error("🔥 Error en webhook:", error);
    res.status(400).json({ success: false, message: error.message });
  }
};

export default clerkWebhooks;
