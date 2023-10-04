import mongoose from "mongoose";
import { LOCATION } from "../list.js";
// import { Location } from "./location.js";
// const Schema = mongoose.Schema;

// const elevatorSchema = new Schema({
//   _id: Schema.Types.ObjectId,
//   name: {
//     type: Schema.Types.ObjectId,
//     ref: "Location",
//   },
//   address: { type: Schema.Types.ObjectId, ref: "Location" },
//   section: { type: Schema.Types.ObjectId, ref: "Section" },
//   elevType: String,
//   weight: String,
//   light: String,
//   backdoor: Boolean,
//   floors: String,
//   faultClaim: {
//     type: Schema.Types.ObjectId,
//     ref: "FaultClaim",
//     created_at: {
//       type: Date,
//       default: new Date().getTime(),
//     },
//   },
//   maintenance: {
//     type: String,
//     created_at: {
//       type: Date,
//       default: new Date().getTime(),
//     },
//   },
//   created_at: {
//     type: Date,
//     default: new Date().getTime(),
//   },
//   updated_at: {
//     type: Date,
//     default: null,
//   },
// });

export function GetElevatorFullList(object) {
  let result = [];
  let arr = [];
  result = object.map((e) => {
    return Object.values(e.section);
  });

  result.forEach((e) => {
    if (e != undefined) arr.push(e);
  });
  arr = arr.flat();
  let elevators = [];
  elevators = arr.map((e) => {
    return Object.values(e);
  });
  elevators = elevators.flat();
  // arr = arr.flat();
  // console.log(elevators);
  return elevators;
}
// export const elevatorsList = GetElevatorFullList(LOCATION);
// export const Elevator = new mongoose.model("Elevator", elevatorSchema);
export const addElevator = (Object) => {
  const {
    id,
    name,
    address,
    section,
    type,
    weight,
    lamp,
    backDoor,
    floors,
    faultClaim,
    maintenance,
  } = Object;

  let elev = {
    name: `${name}`,
    address: `${address}`,
    section: `${section}`,
    elevType: `${type}`,
    weight: `${weight}`,
    light: `${lamp}`,
    backdoor: `${backDoor}`,
    floors: `${floors}`,
    title: `${section}_${id}`,
  };
  // console.log();
  return elev;
};
export const generateElevatorData = (array) => {
  let data = array.reduce((acc, item) => {
    acc.push(addElevator(item));
    return acc;
  }, []);
  if (!data) data = "Error 404 Not found";
  console.log(data);
  return data;
};

// const myDB = client.db("mizui_db");
// const myColl = myDB.collection("elevators");
// const result = await myColl.insertOne(elevator);
// console.log(`A document was inserted with the _id: ${result.insertedId}`);
