import stripe from "stripe";
import Booking from "../models/Booking.js";
import Room from "../models/Room.js";
import User from "../models/User.js";
import transporter from "../config/nodemailer.js";

// API to handle Stripe Webhooks
export const stripeWebhooks = async (request, response) => {
  // Stripe Gateway Initialize
  const stripeInstance = new stripe(process.env.STRIPE_SECRET_KEY);
  const sig = request.headers["stripe-signature"];

  let event;

  try {
    event = stripeInstance.webhooks.constructEvent(
      request.body,
      sig,
      process.env.STRIPE_WEBHOOK_SECRET
    );
  } catch (error) {
    return response.status(400).send(`Webhook Error: ${error.message}`);
  }

  // Handle the event
if (event.type === "checkout.session.completed") {
  const session = event.data.object;

  const { bookingId } = session.metadata;

  // ✅ Mark as paid
  const booking = await Booking.findByIdAndUpdate(
    bookingId,
    { isPaid: true, paymentMethod: "Stripe" },
    { new: true }
  );

  // ✅ Send email to hotel owner
  if (booking) {
    const roomData = await Room.findById(booking.room).populate("hotel");
    const hotelOwner = await User.findById(roomData.hotel.owner);

    if (hotelOwner?.email) {
      const mailOptions = {
        from: process.env.SENDER_EMAIL,
        to: hotelOwner.email,
        subject: "New Booking Confirmed - Payment Received",
        html: `
          <h2>Your room has been booked and paid</h2>
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

      try {
        await transporter.sendMail(mailOptions);
        console.log("📩 Email sent to hotel owner:", hotelOwner.email);
      } catch (err) {
        console.error("❌ Error sending email:", err.message);
      }
    }
  }
}
 else {
    console.log("Unhandled event type:", event.type);
  }

  response.json({ received: true });
};
