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
        const existingUser = await User.findOne({ email: data.email_address });

        if (existingUser) {
          if (!existingUser.isActive) {
            console.log(`⚠️ Usuario ${data.email_address} está inactivo, no se recrea.`);
            return res.status(200).json({ success: false, message: "Usuario inactivo, no creado" });
          } else {
            console.log(`ℹ️ Usuario ${data.email_address} ya existe y está activo.`);
            return res.status(200).json({ success: true, message: "Usuario ya existente" });
          }
        }

        await User.create({
          _id: data.id,
          username: `${data.first_name || ""} ${data.last_name || ""}`.trim() || "Sin nombre",
          email: data.email_address,
          image: data.image_url,
        });

        console.log(`✅ Usuario ${data.email_address} creado correctamente.`);
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
