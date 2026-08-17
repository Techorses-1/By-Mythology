const mongoose = require("mongoose");
const { v4: uuidv4 } = require("uuid");

const newsletterSchema = new mongoose.Schema(
  {
    newsletterId: {
      type: String,
      unique: true,
      default: uuidv4,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
      match: [/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/, "Please enter a valid email"],
    },
    name: {
      type: String,
      default: "",
      trim: true,
    },
    isSubscribed: {
      type: Boolean,
      default: true,
    },
    subscribedAt: {
      type: Date,
      default: Date.now,
    },
    unsubscribedAt: {
      type: Date,
      default: null,
    },
    source: {
      type: String,
      enum: ["website", "checkout", "popup", "other", "homepage" , "footer"],
      default: "website",
    },
  },
  {
    timestamps: true,
    indexes: [
      { email: 1 },
      { isSubscribed: 1 },
      { subscribedAt: -1 },
    ],
  }
);

module.exports = mongoose.model("Newsletter", newsletterSchema);