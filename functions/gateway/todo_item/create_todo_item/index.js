"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.handler = exports.main = exports.validator = void 0;
const Joi = __importStar(require("joi"));
const common_1 = require("common");
const uuid_1 = require("uuid");
const validator = (event) => {
    const schema = Joi.object({
        "body": Joi.object({
            "completed": Joi.boolean().required(),
            "label": Joi.string().required(),
        }).unknown(true),
    }).unknown(true);
    return schema.validate(event);
};
exports.validator = validator;
const main = async (event) => {
    const postData = event.body;
    const todoItemId = (0, uuid_1.v4)();
    const params = {
        "Item": {
            "completed": postData.completed,
            "createdAt": new Date().getTime(),
            "deletedAt": null,
            "id": todoItemId,
            "label": postData.label,
            "status": `OK`,
            "updatedAt": null,
        },
    };
    await (0, common_1.createItem)(params, process.env.DDB_TODO_TABLE, process.env.AWS_REGION);
    const getItemParams = {
        "Key": {
            'id': todoItemId,
        },
    };
    const todoItem = await (0, common_1.getItem)(getItemParams, process.env.DDB_TODO_TABLE, process.env.AWS_REGION);
    console.log(`create_todo_item todoItem get `, todoItem);
    return { "body": todoItem };
};
exports.main = main;
exports.handler = (0, common_1.gatewayLambdaWrapper)(exports.main, exports.validator);
