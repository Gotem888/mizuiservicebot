import mongoose from "mongoose";
import { LOCATION } from "../list.js";
// import { Location } from "./location.js";

const Schema = mongoose.Schema;

const elevatorSchema = new Schema({
  _id: Schema.Types.ObjectId,
  title: String,
  name: String,
  address: String,
  section: String,
  elevType: String,
  weight: String,
  light: String,
  backdoor: Boolean,
  floors: String,
  faultClaim: {
    type: Schema.Types.ObjectId,
    ref: "FaultClaim",
    created_at: {
      type: Date,
      default: new Date().getTime(),
    },
  },
  maintenance: {
    type: String,
    created_at: {
      type: Date,
      default: new Date().getTime(),
    },
  },
  created_at: {
    type: Date,
    default: new Date().getTime(),
  },
  updated_at: {
    type: Date,
    default: null,
  },
});

const sectionSchema = new Schema({
  _id: Schema.Types.ObjectId,
  title: String,
  name: String,
  address: String,
  elevators: [
    {
      type: Schema.Types.ObjectId,
      ref: "Elevator",
    },
  ],
});

const locationSchema = new Schema({
  _id: Schema.Types.ObjectId,
  name: String,
  address: String,
  sections: [
    {
      type: Schema.Types.ObjectId,
      ref: "Section",
    },
  ],
});

export const techMaintenanceSchema = new Schema({
  _id: Schema.Types.ObjectId,
  elevatorId: {
    type: Schema.Types.ObjectId,
    ref: "Elevator",
    required: true,
  },
  created_at: {
    type: Date,
    default: new Date().getTime(),
  },
  notes: {
    type: String,
  },
});

export const faultClaimSchema = new Schema(
  {
    _id: Schema.Types.ObjectId,
    isRepair: {
      type: Boolean,
    },
    text: {
      type: String,
      required: true,
    },
    elevatorId: {
      type: Schema.Types.ObjectId,
      ref: "Elevator",
      required: true,
    },
    created_at: {
      type: Date,
      default: new Date().getTime(),
    },
    updated_at: {
      type: Date,
      default: null,
    },
  },
  { timestamps: true }
);

export const FaultClaim = new mongoose.model(
  "FaultClaim",
  faultClaimSchema,
  "faultClaims"
);

export const Elevator = new mongoose.model(
  "Elevator",
  elevatorSchema,
  "elevators"
);
export const Section = new mongoose.model("Section", sectionSchema, "sections");
export const Location = new mongoose.model(
  "Location",
  locationSchema,
  "locations"
);
export const Tech = new mongoose.model(
  "Tech",
  techMaintenanceSchema,
  "techInfo"
);
