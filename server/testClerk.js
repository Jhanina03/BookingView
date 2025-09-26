import "dotenv/config"; // carga .env
import { clerkClient } from "@clerk/clerk-sdk-node";

async function test() {
  console.log("CLERK_SECRET_KEY:", process.env.CLERK_SECRET_KEY);

  try {
    // Intenta obtener información de un usuario de prueba
    const userId = "user_335QRPnyb8PDRXXvNBeZPEaC5P6"; // tu userId real
    const user = await clerkClient.users.getUser(userId);
    console.log("Usuario obtenido de Clerk:", user);
  } catch (err) {
    console.error("Error de Clerk:", err.message);
  }
}

test();
