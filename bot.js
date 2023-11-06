import { LOCATION, LOCATIONDEN } from "./list.js";
import { Telegraf } from "telegraf";
import { Api, TelegramClient } from "telegram";
import axios from "axios";
import express, { response } from "express";
import Extra from "telegraf";
import { session } from "./node_modules/telegraf/lib/session.js";

import {
  GetLocationList,
  GetSectionList,
  chunkArray,
  GetElevatorList,
  getElevatorInfo,
  getFaults,
  getTechInfo,
} from "./database.js";
import { uniqueUserList, userList } from "./users.js";
import mongoose, { Schema } from "mongoose";
import { MongoClient, ObjectId, ServerApiVersion } from "mongodb";
import { generateLocationData } from "./models/location.js";
import { Location, Elevator, Section, FaultClaim } from "./models/schema.js";
import {
  generateElevatorData,
  GetElevatorFullList,
} from "./models/elevator.js";
// import { Section } from "./models/section.js";
import {
  addElevatorToDB,
  addFaultClaimToDB,
  addLocationToDB,
  addSectionToDB,
  addTechInfoToDB,
  downloadElevatorInfo,
  downloadFaultInfo,
  downloadSectionInfo,
  downloadTechInfo,
  queryRequest,
} from "./models/mongoDBrequest.js";

// import { Elevator } from "./models/elevator.js";
// var Elevator = require("./models/elevator");

const app = express();
export const bot = new Telegraf(
  "6316308618:AAGkTvdRO1Jx07IKZMv6I-juDrO-tsIuoD8"
);
bot.use(session());
let resultArray = [];
const uri =
  "mongodb+srv://gotem888:Romanenko123@cluster0.buvkwub.mongodb.net/?retryWrites=true&w=majority";
//
// Create a MongoClient with a MongoClientOptions object to set the Stable API version
export const client = new MongoClient(uri, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    address: "127.0.0.1:27017",
    deprecationErrors: true,
  },
});
export const myDB = client.db("mizui_db");
async function run() {
  try {
    // Connect the client to the server	(optional starting in v4.7)
    await client.connect();
    // Send a ping to confirm a successful connection
    await client.db("admin").command({ ping: 1 });
    console.log(
      "Pinged your deployment. You successfully connected to MongoDB!"
    );
  } finally {
    await client.close();
  }
}
// await addElevatorToDB();
// await addLocationToDB();
// await addSectionToDB();
export let arrElevat = await downloadElevatorInfo();
// console.log(typeof arrElevat, arrElevat);
export let arrFault = await downloadFaultInfo();
export let arrLoc = await downloadSectionInfo();
export let arrTech = await downloadTechInfo();

run().catch(console.dir);

bot.command("coin", (ctx) => {
  let result = Math.random();
  if (result > 0.5)
    ctx.reply("Орёл").then((r) => {
      setTimeout(() => {
        ctx.deleteMessage(r.message_id);
      }, 3000);
    });
  else
    ctx.reply("Решка").then((r) => {
      setTimeout(() => {
        ctx.deleteMessage(r.message_id);
      }, 3000);
    });
});

bot.command("8ball", (ctx) => {
  let result = Math.random();
  if (result <= 0.25)
    ctx.reply("Нет").then((r) => {
      setTimeout(() => {
        ctx.deleteMessage(r.message_id);
      }, 3000);
    });
  else if (result <= 0.5)
    ctx.reply("Не расчитывай на это").then((r) => {
      setTimeout(() => {
        ctx.deleteMessage(r.message_id);
      }, 3000);
    });
  else if (result < 0.75)
    ctx.reply("Очень возможно!").then((r) => {
      setTimeout(() => {
        ctx.deleteMessage(r.message_id);
      }, 3000);
    });
  else if (result >= 0.75)
    ctx.reply("ДА!!!").then((r) => {
      setTimeout(() => {
        ctx.deleteMessage(r.message_id);
      }, 3000);
    });
});

export const idsElev = arrElevat.map((e) => {
  return e.elevators;
});
const idsElevArr = idsElev.flat().map((e) => {
  return e._id.toString();
});

// const Elevator = mongoose.model("Elevator", elevatorSchema);
let messageId = "";
if (messageId != "") messageId = "";
bot.start((ctx) => {
  ctx.telegram
    .sendPhoto(
      ctx.chat.id,
      "AgACAgIAAxkBAAIbB2UhCr7FnRRYH3cy_ruqXHzrKzoSAAJqzzEbx_QISe4Oc1tU2C8HAQADAgADcwADMAQ",
      {
        caption: "Welcome",
        reply_markup: {
          inline_keyboard: [
            [
              {
                text: "Start",
                callback_data: "start",
              },
            ],
          ],
        },
      }
    )
    .then((m) => {
      messageId = m.message_id;
      let userId = uniqueUserList(userList);
      for (let i = 0; i < userId.length; i++) {
        if (userId[i].user == ctx.chat.id) userId[i].mess = m.message_id;
      }
      userList.push({ user: ctx.chat.id, mess: m.message_id });

      console.log(ctx.chat.id);

      console.log(uniqueUserList(userList));
    });
});

let pastQueryData = [];
let fuckingId = [];
bot
  .action(
    [
      "location",
      "company",
      "start",
      "startOne",
      "dataSec",
      "dataElv",
      "text",
      "locatId64fbceafa93d3ba2ccba1db3",
      "locatId64fbceafa93d3ba2ccba1db4",
      "locatId64fbceb0a93d3ba2ccba1db6",
      "locatId64fbceafa93d3ba2ccba1db5",
      "locatId64fbceb0a93d3ba2ccba1db7",
      "locatId64fbceb0a93d3ba2ccba1db8",
      "locatId64fbceb0a93d3ba2ccba1db9",
      "locatId64fbceb0a93d3ba2ccba1dba",
      "locatId64fbceb0a93d3ba2ccba1dbb",
      "locatId6548e13b8cee72c0e7d59d5f",
      "locatId6548e13b8cee72c0e7d59d60",
      //sections id
      "deFault",
    ],
    async (ctx) => {
      try {
        let faultSec = [];
        arrElevat.map((e) => {
          e.elevators.forEach((z) => {
            for (let f of arrFault) {
              if (
                f.elevatorId.toString() == z._id.toString() &&
                f.isRepair == false
                // &&
              )
                faultSec.push(e._id);
            }
          });
        });
        uniqueUserList(userList).map((e) => {
          if (e.user == ctx.chat.id) messageId = e.mess;
        });
        if (ctx.callbackQuery.data === "start") {
          try {
            ctx.deleteMessage(messageId);
            const resp = ctx.telegram
              .sendMessage(ctx.chat.id, "Найти по...", {
                reply_markup: {
                  inline_keyboard: [
                    [{ text: "-----Адресс-----", callback_data: "location" }],
                    [{ text: "----Заказщик----", callback_data: "company" }],
                  ],
                },
              })
              .then((m) => {
                messageId = m.message_id;
                let userId = uniqueUserList(userList);
                for (let i = 0; i < userId.length; i++) {
                  if (userId[i].user == ctx.chat.id)
                    userId[i].mess = m.message_id;
                }
                userList.push({ user: ctx.chat.id, mess: m.message_id });
              });
          } catch (err) {
            console.error(err);
          }
        }

        if (ctx.callbackQuery.data === "startOne") {
          try {
            ctx.telegram
              .editMessageText(ctx.chat.id, messageId, 0, "Найти по...", {
                reply_markup: {
                  inline_keyboard: [
                    [{ text: "-----Адресс-----", callback_data: "location" }],
                    [{ text: "----Заказщик----", callback_data: "company" }],
                  ],
                },
              })
              .then((m) => {
                messageId = m.message_id;
                let userId = uniqueUserList(userList);
                for (let i = 0; i < userId.length; i++) {
                  if (userId[i].user == ctx.chat.id)
                    userId[i].mess = m.message_id;
                }
                userList.push({ user: ctx.chat.id, mess: m.message_id });
              });
          } catch (err) {
            console.error(err);
          }
        }

        if (ctx.callbackQuery.data === "location") {
          try {
            ctx.answerCbQuery();
            pastQueryData[0] = "location";
            const tasks = await GetLocationList(arrLoc, "address");
            const loc_id = await GetLocationList(arrLoc, "id");
            let result = [];
            let faultLoc = [];
            arrLoc.map((e) => {
              e.sections.forEach((x) => {
                for (let f of faultSec) {
                  if (f._id.toString() == x._id.toString())
                    faultLoc.push(e._id);
                }
              });
            });
            let locationData = "";
            for (let i = 0; i < tasks.length; i++) {
              locationData = `${tasks[i]}`;
              for (let l of faultLoc) {
                if (loc_id[i].toString() == l._id.toString())
                  locationData = " 🚨 " + `${tasks[i]}`;
              }
              result.push({
                text: `${locationData}`,
                callback_data: "locatId" + `${loc_id[i]}`,
              });
            }

            const arr = chunkArray(result, 1);
            arr.push([{ text: "Назад", callback_data: "startOne" }]);
            try {
              ctx.telegram.editMessageText(
                ctx.chat.id,
                messageId,
                0,
                "Адресс",
                {
                  reply_markup: {
                    inline_keyboard: arr,
                  },
                }
              );
            } catch (e) {
              console.error(e);
            }
          } catch (errors) {
            console.error(errors);
          }
        }

        if (ctx.callbackQuery.data === "company") {
          try {
            ctx.answerCbQuery();
            pastQueryData[0] = "company";
            const loc_id = GetLocationList(arrLoc, "id");
            const tasks = GetLocationList(arrLoc, "name");
            const sect = GetLocationList(arrLoc, "section");
            let result = [];
            for (let i = 0; i < tasks.length; i++) {
              result.push({
                text: `${tasks[i]}`,
                callback_data: "locatId" + `${loc_id[i]}`,
              });
            }
            const arr = chunkArray(result, 1);
            arr.push([{ text: "Назад", callback_data: "startOne" }]);
            try {
              bot.telegram.editMessageText(
                ctx.chat.id,
                messageId,
                0,
                "Организация",
                {
                  reply_markup: {
                    inline_keyboard: arr,
                  },
                }
              );
            } catch (e) {
              console.error(e);
            }
          } catch (orror) {
            console.error(orror);
          }
        }

        async function querySectionData(secData) {
          try {
            pastQueryData[1] = "locatId" + secData;
            const secTasks = GetSectionList(arrLoc, secData);
            let res = [];
            let arr = [];
            let sectionData = "";
            for (let i = 0; i < secTasks.length; i++) {
              let secName = secTasks[i].title.split("_")[0];
              let secId = secTasks[i]._id;
              sectionData = "-= " + `${secName}` + " =-";
              for (let t of faultSec) {
                if (secId.toString() == t._id.toString())
                  sectionData = " 🚨 " + "-= " + `${secName}` + " =-";
              }
              res.push({
                text: `${sectionData}`,
                callback_data: "dataSec" + secId,
              });
            }
            arr = chunkArray(res, 1);
            arr.push([{ text: "Назад", callback_data: pastQueryData[0] }]);
            try {
              bot.telegram.editMessageText(
                ctx.chat.id,
                messageId,
                0,
                "Секция",
                {
                  reply_markup: {
                    inline_keyboard: arr,
                  },
                }
              );
            } catch (e) {
              console.error(e);
            }
          } catch (error) {
            console.error(error);
          }
        }

        switch (ctx.callbackQuery.data) {
          case `${"locatId64fbceafa93d3ba2ccba1db3"}`:
            querySectionData("64fbceafa93d3ba2ccba1db3");
            break;
          case `${"locatId64fbceafa93d3ba2ccba1db4"}`:
            querySectionData("64fbceafa93d3ba2ccba1db4");
            break;
          case `${"locatId64fbceb0a93d3ba2ccba1db6"}`:
            querySectionData("64fbceb0a93d3ba2ccba1db6");
            break;
          case `${"locatId64fbceafa93d3ba2ccba1db5"}`:
            querySectionData("64fbceafa93d3ba2ccba1db5");
            break;
          case `${"locatId64fbceb0a93d3ba2ccba1db7"}`:
            querySectionData("64fbceb0a93d3ba2ccba1db7");
            break;
          case `${"locatId64fbceb0a93d3ba2ccba1db8"}`:
            querySectionData("64fbceb0a93d3ba2ccba1db8");
            break;
          case `${"locatId64fbceb0a93d3ba2ccba1db9"}`:
            querySectionData("64fbceb0a93d3ba2ccba1db9");
            break;
          case `${"locatId64fbceb0a93d3ba2ccba1dba"}`:
            querySectionData("64fbceb0a93d3ba2ccba1dba");
            break;
          case `${"locatId64fbceb0a93d3ba2ccba1dbb"}`:
            querySectionData("64fbceb0a93d3ba2ccba1dbb");
            break;
          case `${"locatId6548e13b8cee72c0e7d59d5f"}`:
            querySectionData("6548e13b8cee72c0e7d59d5f");
            break;
          case `${"locatId6548e13b8cee72c0e7d59d60"}`:
            querySectionData("6548e13b8cee72c0e7d59d60");
            break;
        }
      } catch (err) {
        console.error(err);
      }
    }
  )
  .catch(console.dir());
let faultClaimsMessage = [];
bot
  .on("callback_query", async (ctx) => {
    let queryData = ctx.callbackQuery.data;
    let del = queryData.substring(0, 7);
    let dataQuery = queryData.substring(7);
    try {
      if (del === "dataSec") {
        ctx.answerCbQuery();
        pastQueryData[2] = queryData;
        const tasksEl = await GetElevatorList(arrElevat, dataQuery);
        let result = [];
        for (let i = 0; i < tasksEl.length; i++) {
          let typeElev = "";
          if (tasksEl[i].elevType == "Passenger") typeElev = "Пассажирский";
          else if (tasksEl[i].elevType == "Cargo") typeElev = "Грузовой";
          for (let e of arrFault) {
            if (e.elevatorId.toString() == tasksEl[i]._id.toString()) {
              if (e.isRepair == false) {
                if (tasksEl[i].elevType == "Passenger")
                  typeElev = " 🚨 " + "Пассажирский";
                else if (tasksEl[i].elevType == "Cargo")
                  typeElev = " 🚨 " + "Грузовой";
              }
            }
          }
          result.push({
            text: `${typeElev} ` + ` , ${tasksEl[i].weight}`,
            callback_data: "dataElv" + `${tasksEl[i]._id}`,
          });
        }
        const arr = chunkArray(result, 1);
        arr.push([{ text: "Назад", callback_data: pastQueryData[1] }]);
        bot.telegram.editMessageText(ctx.chat.id, messageId, 0, "Лифт", {
          reply_markup: {
            inline_keyboard: arr,
          },
        });
      }

      if (del === "dataElv") {
        ctx.answerCbQuery();
        pastQueryData[3] = queryData;
        const card = await getElevatorInfo(dataQuery);
        let result = bot.telegram.editMessageText(
          ctx.chat.id,
          messageId,
          0,
          `${card}`,
          {
            parse_mode: "HTML",
            reply_markup: {
              inline_keyboard: [
                [
                  {
                    text: "Тех-Обслуживание",
                    callback_data: "techMnt" + `${dataQuery}`,
                  },
                ],
                [
                  {
                    text: "Заявка неисправности",
                    callback_data: "damgAdd" + `${dataQuery}`,
                  },
                ],
                [{ text: "Назад", callback_data: pastQueryData[2] }],
              ],
            },
          }
        );
      }
      if (del === "damgAdd") {
        ctx.answerCbQuery();
        pastQueryData[4] = queryData;
        const card = await getElevatorInfo(dataQuery);
        try {
          await ctx.telegram.editMessageText(
            ctx.chat.id,
            messageId,
            0,
            `${card}`,
            {
              parse_mode: "HTML",
              reply_markup: {
                inline_keyboard: [
                  [
                    {
                      text: "Просмотр заявок",
                      callback_data: "dmgLook" + `${dataQuery}`,
                    },
                  ],
                  [
                    {
                      text: "Добавить заявку",
                      callback_data: "addDamg" + `${dataQuery}`,
                    },
                  ],
                  [
                    {
                      text: "Назад",
                      callback_data: pastQueryData[3],
                    },
                  ],
                ],
              },
            }
          );
        } catch (err) {
          console.error(err);
        }
      }
      //===========================================================================================

      if (del === "chFault") {
        ctx.answerCbQuery();
        await updateFaultClaim(dataQuery);
        ctx.sendMessage("Статус заявки 'Исправлено'").then((r) => {
          setTimeout(() => {
            ctx.deleteMessage(r.message_id);
          }, 3000);
        });
      }
      if (del === "deFault") {
        ctx.answerCbQuery();
        let resp = faultClaimsMessage;
        resp.forEach((e) => {
          try {
            let res = ctx.telegram.deleteMessage(ctx.chat.id, e);
          } catch (e) {
            console.error(e);
          }
        });
        await deleteFault(dataQuery);
        await ctx.telegram
          .sendMessage(ctx.chat.id, "Заявка успешно удалена")
          .then((r) => {
            setTimeout(() => {
              ctx.deleteMessage(r.message_id);
            }, 3000);
          });
      }

      if (del === "techMnt") {
        ctx.answerCbQuery();
        pastQueryData[4] = queryData;
        const card = await getElevatorInfo(dataQuery);
        try {
          await ctx.telegram.editMessageText(
            ctx.chat.id,
            messageId,
            0,
            `${card}`,
            {
              parse_mode: "HTML",
              reply_markup: {
                inline_keyboard: [
                  [
                    {
                      text: "Отметки о проведённом ТО",
                      callback_data: "lookFor" + `${dataQuery}`,
                    },
                  ],
                  [
                    {
                      text: "Добавить отметку о ТО",
                      callback_data: "addTOdb" + `${dataQuery}`,
                    },
                  ],
                  [
                    {
                      text: "Назад",
                      callback_data: pastQueryData[3],
                    },
                  ],
                ],
              },
            }
          );
        } catch (err) {
          console.error(err);
        }
      }
      if (del === "addTOdb") {
        ctx.answerCbQuery();
        const techTime = new Date().getTime();
        const elevatorId = dataQuery;
        const techCard = {
          elevatorId: elevatorId,
          created_at: techTime,
        };
        await addTechInfoToDB(techCard);
        try {
          await client.connect();
          arrTech = await downloadTechInfo();
          await client.close();
          ctx
            .sendMessage("Отметка о ТО успешно добавлена")
            .then((r) => {
              setTimeout(() => {
                ctx.deleteMessage(r.message_id);
              }, 3000);
            })
            .catch((err) => console.log(err));
        } catch (err) {
          console.error(err);
        }
      }
      if (del === "lookFor") {
        try {
          ctx.answerCbQuery();
          const messageResult = await getTechInfo(dataQuery);
          const card = await getElevatorInfo(dataQuery);
          await bot.telegram.editMessageText(
            ctx.chat.id,
            messageId,
            0,
            `${card}\n` +
              "<b>ТО проводилось:</b>\n" +
              `<i>${messageResult}</i>`,
            {
              parse_mode: "HTML",
              reply_markup: {
                inline_keyboard: [
                  [{ text: "Назад", callback_data: pastQueryData[4] }],
                ],
              },
            }
          );
        } catch (err) {
          console.error(err);
        }
      }

      if (del === "dmgLook") {
        try {
          faultClaimsMessage = [];
          ctx.answerCbQuery();
          let faultList = await getFaults(dataQuery);
          let inlineButtons = [];
          if (faultList.length < 1) {
            ctx.telegram
              .sendMessage(ctx.chat.id, "Заявки отсутствуют")
              .then((r) => {
                setTimeout(() => {
                  ctx.deleteMessage(r.message_id);
                }, 3000);
              });
          } else {
            for await (let e of faultList) {
              if (e.substring(e.length - 1) == "n") {
                inlineButtons.push(
                  {
                    text: "УСТРАНЕНО",
                    callback_data:
                      "chFault" + `${e.substring(e.length - 25, e.length - 1)}`,
                  },
                  {
                    text: "Удалить",
                    callback_data:
                      "deFault" + `${e.substring(e.length - 25, e.length - 1)}`,
                  }
                );
              } else if (e.substring(e.length - 1) == "y") {
                inlineButtons.push({
                  text: "Удалить",
                  callback_data:
                    "deFault" + `${e.substring(e.length - 25, e.length - 1)}`,
                });
              }
              await ctx.telegram
                .sendMessage(ctx.chat.id, e.substring(0, e.length - 25), {
                  parse_mode: "HTML",
                  reply_markup: {
                    inline_keyboard: [
                      inlineButtons,
                      [
                        {
                          text: "СКРЫТЬ ВСЕ",
                          callback_data: "clear",
                        },
                      ],
                    ],
                  },
                })
                .then((r) => {
                  faultClaimsMessage.push(r.message_id);
                  inlineButtons = [];
                });
            }
          }
        } catch (errr) {
          console.error(errr);
        }
      }
      if (ctx.callbackQuery.data === "clear") {
        let res = faultClaimsMessage;
        let resBackUp;
        if (res != []) {
          resBackUp = res;
        } else res = resBackUp;
        // console.log("metka", res, resBackUp);
        res.forEach(async (e) => {
          try {
            let resp = await ctx.telegram.deleteMessage(ctx.chat.id, e);
            if (resp) {
              faultClaimsMessage = [];
              resBackUp = [];
            }
          } catch (err) {
            console.error(err);
          }
        });
        res = [];
      }
      if (del === "addDamg") {
        await ctx.telegram
          .sendMessage(
            ctx.chat.id,
            "Опишите неисправность и отправте сообщение"
          )
          .then((r) => {
            fuckingId.push(r.message_id);
            fuckingId.push(dataQuery);
          })
          .then((response) => {
            bot.on("text", async (ctx) => {
              ctx.session = {
                taskText: `${ctx.message.text}`,
                taskId: `${ctx.message.message_id}`,
              };
              dataQuery = queryData.substring(7);
              let result = {
                isRepair: false,
                text: `${ctx.message.text}`,
                elevatorId: `${fuckingId[1]}`,
                created_at: new Date().getTime(),
              };
              await addFaultClaimToDB(result).then(async (sec_response) => {
                try {
                  await ctx.telegram.editMessageText(
                    ctx.chat.id,
                    fuckingId[-0],
                    0,
                    "Заявка успешно добавлена, обновление базы"
                  );
                  await client.connect();
                  arrFault = await downloadFaultInfo();
                  await client.close();
                  await ctx.deleteMessage(ctx.session.taskId);
                  await ctx.deleteMessage(fuckingId[-0]);
                  console.log(
                    `A document was inserted with the _id: ${result.insertedId}`
                  );
                  fuckingId = [];
                  dataQuery = "";
                } catch (e) {
                  console.error(e);
                }
              });
            });
          })
          .catch(console.dir);
      }
    } catch (erro) {
      console.error(erro);
    }
  })
  .catch(console.dir);

async function deleteFault(info) {
  try {
    await client.connect();
    const faultColl = myDB.collection("faultClaims");
    const removeFault = await FaultClaim({ _id: info });

    const result = await faultColl.deleteOne({ _id: removeFault._id });
    console.log("Заявка успешно удалена", result);
    arrFault = await downloadFaultInfo();
    await client.close();
  } catch (err) {
    console.dir(err);
  }
}

export async function updateFaultClaim(info) {
  try {
    await client.connect();
    const faultColl = myDB.collection("faultClaims");
    const updateFault = await FaultClaim({ _id: info });
    const result = await faultColl.updateOne(
      { _id: updateFault._id },
      { $set: { isRepair: true } },
      (err, res) => {}
    );
    console.log(`A document was updated successfully`, result);
    arrFault = await downloadFaultInfo();
    await client.close();
  } catch (err) {
    console.error(err);
  }
}

run().catch(console.dir);
bot.launch().catch(console.dir);

process.once("SIGINT", () => bot.stop("SIGINT"));
process.once("SIGTERM", () => bot.stop("SIGTERM"));
