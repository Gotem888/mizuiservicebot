import mongoose from "mongoose";
import { generateLocationData } from "./location.js";
import { generateElevatorData } from "./elevator.js";
import { LOCATION, LOCATIONDEN } from "../list.js";
import { myDB, client } from "../bot.js";
import {
  Elevator,
  Section,
  Location,
  FaultClaim,
  Tech,
  faultClaimSchema,
} from "./schema.js";
import { generateSectionData } from "./section.js";

export async function downloadSectionInfo() {
  const aggSec = [
    {
      $lookup: {
        from: "sections",
        localField: "name",
        foreignField: "name",
        as: "sections",
      },
    },
  ];
  const collLoc = client.db("mizui_db").collection("locations");
  let cursorLoc = collLoc.aggregate(aggSec);
  let result = await cursorLoc.toArray();
  return result;
}

export async function downloadElevatorInfo() {
  const aggElev = [
    {
      $lookup: {
        from: "elevators",
        localField: "title",
        foreignField: "title",
        as: "elevators",
      },
    },
  ];
  const collSec = client.db("mizui_db").collection("sections");
  let cursorSec = collSec.aggregate(aggElev);
  let result = await cursorSec.toArray();
  return result;
}

export async function downloadTechInfo() {
  const aggTech = [
    {
      $lookup: {
        from: "techInfo",
        localField: "_id",
        foreignField: "elevatorId",
        as: "maintenance",
      },
    },
  ];
  const collTech = client.db("mizui_db").collection("techInfo");
  let cursorTech = collTech.aggregate(aggTech);
  let resultTech = await cursorTech.toArray();
  return resultTech;
}

export async function downloadFaultInfo() {
  const aggFault = [
    {
      $lookup: {
        from: "faultClaims",
        localField: "_id",
        foreignField: "elevatorId",
        as: "faultClaims",
      },
    },
  ];
  const collFault = client.db("mizui_db").collection("faultClaims");
  let cursorFault = collFault.aggregate(aggFault);
  let resultFault = await cursorFault.toArray();
  return resultFault;
}

export async function addElevatorToDB() {
  const elevator = generateElevatorData(LOCATIONDEN);
  const elevColl = myDB.collection("elevators");
  for (let ele of elevator) {
    const addingElev = await Elevator(ele);
    const result = await elevColl.insertOne(addingElev);
    console.log(`A document was inserted with the _id: ${result.insertedId}`);
  }
}
export async function addLocationToDB() {
  const location = generateLocationData(LOCATIONDEN);
  const locationColl = myDB.collection("locations");
  for (let loc of location) {
    const addingLoc = await Location(loc);
    const result = await locationColl.insertOne(addingLoc);
    console.log(`A document was inserted with the _id: ${result.insertedId}`);
  }
}

export async function addSectionToDB() {
  const section = generateSectionData(LOCATIONDEN);
  const secColl = myDB.collection("sections");
  // await Section.create(section);
  for (let sec of section) {
    const addingSec = await Section(sec);
    const result = await secColl.insertOne(addingSec);
    console.log(`A document was inserted with the _id: ${result.insertedId}`);
  }
}

export async function addFaultClaimToDB(object) {
  await client.connect();
  const faultColl = myDB.collection("faultClaims");
  const addingFault = await FaultClaim(object);
  const result = await faultColl.insertOne(addingFault);
  console.log(
    `A document was adding successfully with _id: ${result.insertedId}`
  );
  await client.close();
  return true;
}

export async function addTechInfoToDB(object) {
  await client.connect();
  const techColl = myDB.collection("techInfo");
  const addingTech = await Tech(object);
  const result = await techColl.insertOne(addingTech);
  console.log(
    `A document was adding successfully with _id: ${result.insertedId}`
  );
  await client.close();
}

export async function addDataToDB(arr) {}

export async function queryRequest(object, Model) {
  const some = await Model.find({}, object).toArray();
  return some;
}
