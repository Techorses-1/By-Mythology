const mongoose = require("mongoose");
const { v4: uuidv4 } = require("uuid");

const contactSchema = new mongoose.Schema(
  {
    contactId: {
      type: String,
      unique: true,
      default: uuidv4,
    },
    name: {
      type: String,
      required: true,
      trim: true,
    },
    email: {
      type: String,
      required: true,
      lowercase: true,
      trim: true,
    },
    phone: {
      type: String,
      required: true,
      trim: true,
      match: [/^[6-9]\d{9}$/, "Please enter valid 10-digit mobile number"],
    },
    subject: {
      type: String,
      required: true,
      enum: ["product-inquiry", "order-status", "wholesale", "collaboration", "other"],
    },
    message: {
      type: String,
      required: true,
      trim: true,
      maxlength: 5000,
    },
    status: {
      type: String,
      enum: ["pending", "read", "replied", "archived"],
      default: "pending",
    },
    adminNote: {
      type: String,
      default: "",
    },
    isActive: {
      type: Boolean,
      default: true,
    },
  },
  {
    timestamps: true,
    indexes: [
      { email: 1 },
      { phone: 1 },
      { status: 1 },
      { createdAt: -1 },
    ],
  }
);

module.exports = mongoose.model("Contact", contactSchema);