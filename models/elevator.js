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
  return elevators;
}

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
    model,
    mechanic,
    mechanicPhone,
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
    model: `${model}`,
    mechanic: `${mechanic}`,
    mechanicPhone: `${mechanicPhone}`,
  };
  return elev;
};
export const generateElevatorData = (array) => {
  let data = array.reduce((acc, item) => {
    acc.push(addElevator(item));
    return acc;
  }, []);
  if (!data) data = "Error 404 Not found";
  return data;
};
