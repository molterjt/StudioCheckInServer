"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var prisma_lib_1 = require("prisma-client-lib");
var typeDefs = require("./prisma-schema").typeDefs;

var models = [
  {
    name: "User",
    embedded: false
  },
  {
    name: "BeltPromotion",
    embedded: false
  },
  {
    name: "PromotionType",
    embedded: false
  },
  {
    name: "PositionType",
    embedded: false
  },
  {
    name: "BeltColor",
    embedded: false
  },
  {
    name: "ClassSession",
    embedded: false
  },
  {
    name: "ClassPeriod",
    embedded: false
  },
  {
    name: "Academy",
    embedded: false
  },
  {
    name: "Technique",
    embedded: false
  },
  {
    name: "Tag",
    embedded: false
  },
  {
    name: "Instructor",
    embedded: false
  },
  {
    name: "CheckIn",
    embedded: false
  },
  {
    name: "Event",
    embedded: false
  }
];
exports.Prisma = prisma_lib_1.makePrismaClientClass({
  typeDefs,
  models,
  endpoint: `http://localhost:4466`
});
exports.prisma = new exports.Prisma();
