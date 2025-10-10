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

    const payload = req.body.toString("utf8");
    await whook.verify(payload, headers);

    const { data, type } = JSON.parse(payload);
    console.log("🔔 Webhook recibido:", type, data.id);

    switch (type) {
    case "user.created": {
        const email = data.email_addresses[0]?.email_address;
        let user = await User.findOne({ email });

        if (user) {
            // Usuario ya existe, solo actualizar campos relevantes
            user._id = data.id; // opcional, si quieres mantener el ID de Clerk
            user.username = `${data.first_name || ""} ${data.last_name || ""}`.trim();
            user.image = data.image_url || "";
            user.isActive = true; // reactiva si estaba inactivo
            await user.save();
            console.log(`🟡 Usuario existente actualizado: ${user.email}`);
        } else {
            // Crear usuario nuevo
            const userData = {
                _id: data.id,
                email,
                username: `${data.first_name || ""} ${data.last_name || ""}`.trim(),
                image: data.image_url || "",
                role: "user",
                recentSearchedCities: [],
                isActive: true,
            };
            await User.create(userData);
            console.log(`✅ Usuario creado: ${userData.email}`);
        }
        break;
    }

      case "user.updated": {
        const email = data.email_addresses[0]?.email_address || "";
        const userData = {
          username: `${data.first_name || ""} ${data.last_name || ""}`.trim(),
          image: data.image_url || "",
        };
        const updatedUser = await User.findOneAndUpdate({ email }, userData, { new: true });
        console.log(`🟡 Usuario actualizado en DB: ${updatedUser?._id || "No encontrado"}`);
        break;
      }

      case "user.deleted": {
        const updatedUser = await User.findByIdAndUpdate(
          data.id,
          { isActive: false },
          { new: true }
        );
        console.log("Usuario desactivado:", updatedUser?._id);

        const hotels = await Hotel.find({ owner: data.id });
        for (const hotel of hotels) {
          await Room.updateMany({ hotel: hotel._id }, { $set: { isAvailable: false } });
        }
        break;
      }

      default:
        console.log(`⚪ Evento no manejado: ${type}`);
        break;
    }

    res.json({ success: true, message: "Webhook recibido" });
  } catch (error) {
    console.error("🔥 Error en webhook:", error);
    res.status(400).json({ success: false, message: error.message });
  }
};

export default clerkWebhooks;
