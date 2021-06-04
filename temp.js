"use strict";
exports.__esModule = true;
var bcryptjs = require("bcryptjs");
var str = bcryptjs.hashSync("admin", 12);
console.log(str);