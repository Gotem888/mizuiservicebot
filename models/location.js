import mongoose from "mongoose";
// import { Location, Elevator } from "./schema";
// const Schema = mongoose.Schema;

// const locationSchema = new Schema({
//   _id: Schema.Types.ObjectId,
//   name: String,
//   address: String,
//   section: [
//     {
//       _id: { type: Schema.Types.ObjectId, ref: "Section" },
//       title: String,
//       elevator: [{ type: Schema.Types.ObjectId, ref: "Elevator" }],
//     },
//   ],
// });

// export const Location = new mongoose.model("Location", locationSchema);

export const addLocation = (Object) => {
  const { name, address, id } = Object;
  let locInfo = {
    name: `${name}`,
    address: `${address}`,
  };
  // console.log(locInfo);
  return locInfo;
};

export const generateLocationData = (array) => {
  let data = array.reduce((acc, item) => {
    acc.push(addLocation(item));
    return acc;
  }, []);

  let arr = data.filter(
    (
      (el) => (f) =>
        !el.has(f.name) && el.add(f.name)
    )(new Set())
  );
  Object.assign({}, arr);
  if (!arr) arr = "Error 404 Not found";
  console.log(arr);
  return arr;
};
