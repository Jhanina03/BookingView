import stripe from "stripe";
import Booking from "../models/Booking.js";
import Room from "../models/Room.js";
import User from "../models/User.js";
import transporter from "../config/nodemailer.js";

export const stripeWebhooks = async (req, res) => {
  const stripeInstance = new stripe(process.env.STRIPE_SECRET_KEY);
  const sig = req.headers["stripe-signature"];

  let event;
  try {
    event = stripeInstance.webhooks.constructEvent(
      req.body,
      sig,
      process.env.STRIPE_WEBHOOK_SECRET
    );
  } catch (error) {
    return res.status(400).send(`Webhook Error: ${error.message}`);
  }

  // ✅ Este es el evento correcto
  if (event.type === "checkout.session.completed") {
    const session = event.data.object;
    const { bookingId } = session.metadata;

    // Marcar booking como pagado
    const booking = await Booking.findByIdAndUpdate(
      bookingId,
      { isPaid: true, paymentMethod: "Stripe" },
      { new: true }
    );

    if (booking) {
      // Obtener datos del cuarto y hotel
      const roomData = await Room.findById(booking.room).populate("hotel");
      const hotelOwner = await User.findById(roomData.hotel.owner);

      // ✅ Enviar correo al dueño del hotel
      if (hotelOwner?.email) {
        const mailOptions = {
          from: process.env.SENDER_EMAIL,
          to: hotelOwner.email,
          subject: "New Booking Confirmed - Payment Received",
          html: `
            <h2>New Booking Paid</h2>
            <p>Hello ${hotelOwner.username},</p>
            <p>A payment has been confirmed for your hotel <strong>${roomData.hotel.name}</strong>.</p>
            <ul>
              <li><strong>Booking ID:</strong> ${booking._id}</li>
              <li><strong>Room:</strong> ${roomData.name}</li>
              <li><strong>Check-in:</strong> ${booking.checkInDate.toDateString()}</li>
              <li><strong>Check-out:</strong> ${booking.checkOutDate.toDateString()}</li>
              <li><strong>Amount Paid:</strong> $${booking.totalPrice}</li>
            </ul>
          `,
        };
        await transporter.sendMail(mailOptions);
      }
    }
  } else {
    console.log("Unhandled event type:", event.type);
  }

  res.json({ received: true });
};
