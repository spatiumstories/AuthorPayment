"use strict";
var __create = Object.create;
var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __getProtoOf = Object.getPrototypeOf;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __export = (target, all) => {
  for (var name in all)
    __defProp(target, name, { get: all[name], enumerable: true });
};
var __copyProps = (to, from, except, desc) => {
  if (from && typeof from === "object" || typeof from === "function") {
    for (let key of __getOwnPropNames(from))
      if (!__hasOwnProp.call(to, key) && key !== except)
        __defProp(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable });
  }
  return to;
};
var __toESM = (mod, isNodeMode, target) => (target = mod != null ? __create(__getProtoOf(mod)) : {}, __copyProps(
  // If the importer is in node compatibility mode or this is not an ESM
  // file that has been converted to a CommonJS file using a Babel-
  // compatible transform (i.e. "__esModule" has not been set), then set
  // "default" to the CommonJS "module.exports" for node compatibility.
  isNodeMode || !mod || !mod.__esModule ? __defProp(target, "default", { value: mod, enumerable: true }) : target,
  mod
));
var __toCommonJS = (mod) => __copyProps(__defProp({}, "__esModule", { value: true }), mod);

// delete-rare-book.ts
var delete_rare_book_exports = {};
__export(delete_rare_book_exports, {
  handler: () => handler
});
module.exports = __toCommonJS(delete_rare_book_exports);
var AWS = __toESM(require("aws-sdk"));
var TABLE_NAME = process.env.TABLE_NAME || "";
var PRIMARY_KEY = process.env.PRIMARY_KEY || "";
var SORT_KEY = process.env.SORT_KEY || "";
var db = new AWS.DynamoDB.DocumentClient();
var handler = async (event = {}) => {
  if (!event.body) {
    return { statusCode: 400, body: "Need postHashHex and serial number" };
  }
  const book = typeof event.body == "object" ? event.body : JSON.parse(event.body);
  const postHashHex = book[PRIMARY_KEY];
  const serial = book[SORT_KEY];
  const params = {
    TableName: TABLE_NAME,
    Key: {
      [PRIMARY_KEY]: postHashHex,
      [SORT_KEY]: serial
    }
  };
  try {
    await db.delete(params).promise();
    return { statusCode: 200, body: "success!" };
  } catch (dbError) {
    return { statusCode: 500, body: JSON.stringify(dbError) };
  }
};
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  handler
});
