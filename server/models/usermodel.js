import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    email: { type: String, required: true, unique: true, lowercase: true },
    password: { type: String, required: true },
    verifyOtp: { type: String, default: '' },
    verifyOtpExpireAt: { type: Number, default: 0 },
    isAccountVerified: { type: Boolean, default: false },
    resetOtp: { type: String, default: '' },
    resetOtpExpireAt: { type: Number, default: 0 },
    
    phone: { type: String, default: null },
    avatarUrl: { type: String, default: null },

    // Roles y permisos
    isAdmin: { type: Boolean, default: false }, // Administrador del sistema
    isOwner: { type: Boolean, default: false }, // Cliente que publica inmuebles

    // Estado
    isActive: { type: Boolean, default: true },
    lastLogin: { type: Date, default: null }
  },
  {
    timestamps: true
  }
);

const userModel= mongoose.models.user || mongoose.model("user", userSchema);

export default userModel;
