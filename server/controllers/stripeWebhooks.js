import stripe from "stripe";
import Booking from "../models/Booking.js";

// Webhook de Stripe
export const stripeWebhooks = async (request, response) => {
  const stripeInstance = new stripe(process.env.STRIPE_SECRET_KEY);
  const sig = request.headers["stripe-signature"];
  let event;

  try {
    // Stripe requiere el body crudo para verificar la firma
    event = stripeInstance.webhooks.constructEvent(
      request.body,
      sig,
      process.env.STRIPE_WEBHOOK_SECRET
    );
  } catch (error) {
    console.error("⚠️ Webhook signature verification failed:", error.message);
    return response.status(400).send(`Webhook Error: ${error.message}`);
  }

  // Manejar solo eventos de checkout completados
  if (event.type === "checkout.session.completed") {
    const session = event.data.object;
    const bookingId = session.metadata.bookingId;

    try {
      await Booking.findByIdAndUpdate(bookingId, {
        isPaid: true,
        paymentMethod: "Stripe",
      });
      console.log(`✅ Booking ${bookingId} marked as paid.`);
    } catch (error) {
      console.error("Error updating booking:", error);
    }
  } else {
    console.log("Unhandled event type:", event.type);
  }

  response.json({ received: true });
};
