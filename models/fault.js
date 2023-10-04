import mongoose from "mongoose";

const Schema = mongoose.Schema;

const faultSchema = new Schema({
  elevatorId: String,
  elevLoc: { type: Schema.Types.ObjectId, ref: "Elevator" },
  faultText: String,
  created_at: {
    type: Date,
    default: new Date().getTime(),
  },
  updated_at: {
    type: Date,
    default: null,
  },
});

export const FaultClaim = new mongoose.model("FaultClaim", faultSchema);
