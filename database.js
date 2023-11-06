import e from "express";
import { ObjectId } from "mongodb";
import { LOCATION } from "./list.js";
import { bot, idsElev, arrLoc, arrElevat, arrFault, arrTech } from "./bot.js";

export function chunkArray(array, chunk) {
  const newArray = [];
  for (let i = 0; i < array.length; i += chunk) {
    newArray.push(array.slice(i, i + chunk));
  }
  return newArray;
}

export function GetLocationList(object, info) {
  console.log(object, info);
  let result = [];
  let arr = [];
  result = object.map((e) => {
    if (info == "name") return e.name;
    if (info == "address") return e.address;
    if (info == "section") return e.sections;
    if (info == "id") return e._id;
  });

  arr = result.filter(
    (
      (el) => (f) =>
        !el.has(f) && el.add(f)
    )(new Set())
  );
  return arr;
}
export function GetSectionList(object, info) {
  let arr = [];
  let result = [];
  result = object
    .map((e) => {
      if (info == e._id.toString()) return e.sections;
    })
    .forEach((e) => {
      if (e != undefined) arr.push(e);
    });

  arr = arr.flat();

  return arr;
}

export function GetElevatorList(object, idSec) {
  let result = [];
  let arr = [];

  result = object.map((e) => {
    if (idSec == e._id) {
      return e.elevators;
    }
  });

  result.forEach((e) => {
    if (e != undefined) arr.push(e);
  });
  let elevators = [];
  elevators = arr.flat();
  return elevators;
}

export function getElevatorInfo(info) {
  let elevList = idsElev.flat();
  let result = [];

  elevList
    .map((e) => {
      if (e._id == info) return e;
    })
    .forEach((e) => {
      if (e != undefined) result.push(e);
    });
  let arr = {};
  arr = result[0];

  const {
    elevType,
    weight,
    floors,
    light,
    section,
    address,
    backdoor,
    model,
    mechanic,
    mechanicPhone,
  } = arr;
  let typeElev = "";
  let doorBack = "";
  if (elevType == "Passenger") typeElev = "Пассажирский";
  else if (elevType == "Cargo") typeElev = "Грузовой";
  if (backdoor == true) doorBack = "Да";
  else doorBack = "Нет";
  const card = `
  '<b><i>${address}</i></b>
  <i>Секция:</i> <b>${section}</b>

  <b>${typeElev}</b>\n
  Грузоподъёмность: <b>${weight}</b>kg.
  Этажность: <b>${floors}</b>эт.
  Задняя дверь: ${doorBack}.
  Размер лампы: ${light} .
  Модель: <b>${model}</b>.
  Механик: <b><i>${mechanic}</i></b>.
  Телефон механика: <b>${mechanicPhone}</b>\n`;

  return card;
}

export function getFaults(info) {
  let faultList = [];
  let faultResult = [];
  faultList = arrFault.map((e) => {
    if (e.elevatorId.toString() == info) return e;
  });
  faultList.forEach((e) => {
    if (e != undefined) {
      faultResult.push(e);
    }
  });
  let elevList = idsElev.flat();
  let result = [];

  elevList
    .map((e) => {
      if (e._id == info) return e;
    })
    .forEach((e) => {
      if (e != undefined) result.push(e);
    });
  let arr = {};
  arr = result[0];

  const faultCard = (object) => {
    const { _id, elevatorId, isRepair, created_at, text } = object;

    let isRepairRes = "";
    let isRep = "";
    if (isRepair == false) {
      isRepairRes = "🚨 ";
      isRep = "n";
    } else {
      isRepairRes = "✅ ";
      isRep = "y";
    }
    const options = {
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "numeric",
      minute: "numeric",
      second: "numeric",
      timeZone: "europe/kiev",
    };
    const faultCard =
      `
       ${isRepairRes} <b><i>${arr.address}</i></b>
       Секция: <b><i>${arr.section}</i></b>\n
      <b>${text}.</b>\n
    ${created_at.toLocaleString("en-GB", options)}.
    ` +
      _id +
      isRep;
    return faultCard;
  };

  let data = faultResult.map((e) => {
    return faultCard(e);
  });
  if (!data) data = "Error 404 Not found";
  return data;
}

export function getElevatorLocation(object, data) {
  let elAdr = "";
  let arr = [];
  let elSec = data.section;
  let result = object.map((e) => {
    if (e._id == data) return e.address;
  });
  result.forEach((e) => {
    if (e != undefined) arr.push(e);
  });
  elAdr = `<b> ${arr[0]}</b>
  Секция: <b>${elSec}</b>`;
  return elAdr;
}

export async function getTechInfo(dataQuery) {
  let techList = {};
  const result = arrTech.map((e) => {
    if (e.elevatorId.toString() == dataQuery) {
      return e;
    }
  });
  let arr = [];
  result.forEach((i) => {
    if (i != undefined) arr.push(i);
  });
  const techCard = (object) => {
    const options = {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "numeric",
      minute: "numeric",
      second: "numeric",
      timeZone: "europe/kiev",
    };
    const { _id, elevatorId, created_at, notes } = object;
    const techCard = `
    ${created_at.toLocaleString("en-GB", options)}.\n`;
    return techCard;
  };
  techList = arr.reduce((acc, item) => {
    acc += techCard(item);
    return acc;
  }, "");

  return techList;
}
