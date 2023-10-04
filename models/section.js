import mongoose from "mongoose";

// const Schema = mongoose.Schema;

// const sectionSchema = new Schema({
//   _id: Schema.Types.ObjectId,
//   title: String,
//   name: { type: Schema.Types.ObjectId, ref: "Location" },
//   address: { type: Schema.Types.ObjectId, ref: "Location" },
//   elevator: [{ type: Schema.Types.ObjectId, ref: "Elevator" }],
// });

// export const Section = new mongoose.model("Section", sectionSchema);

export const addSection = (Object) => {
  const { name, address, section, id } = Object;
  let secInfo = {
    name: `${name}`,
    address: `${address}`,
    title: `${section}_${id}`,
  };

  return secInfo;
};

export const generateSectionData = (array) => {
  let data = array.reduce((acc, item) => {
    acc.push(addSection(item));
    return acc;
  }, []);

  let arr = data.filter(
    (
      (el) => (f) =>
        !el.has(f.title) && el.add(f.title)
    )(new Set())
  );
  Object.assign({}, arr);
  if (!arr) arr = "Error 404 Not found";
  console.log(arr);
  return arr;
};
