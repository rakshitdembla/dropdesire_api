import mongoose from "mongoose";

const otpSchema = new mongoose.Schema(
  {
    email: { type: String },
    phone: { type: String },
    otp: { type: String, required: true },
    expiresAt: { type: Date, required: true, expires: 300 },
  },
  { timestamps: true }
);

otpSchema.pre("save", function () {
  if (!this.email || !this.phone) {
    return next(new Error("Either email or mobile must be provided."));
  }
  next();
});

export default mongoose.model("Otp", otpSchema);
