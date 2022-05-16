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
const Joi = __importStar(require("joi"));
const common_1 = require("common");
const validator = (event) => {
    const schema = Joi.object({
        "body": Joi.object({
            "completed": Joi.boolean().required(),
            "label": Joi.string().required(),
        }).unknown(true),
        "pathParameters": Joi.object({
            "todoItemId": Joi.string().uuid({ "version": `uuidv4` }).required(),
        }),
    }).unknown(true);
    return schema.validate(event);
};
const main = async (event) => {
    const { todoItemId } = event.pathParameters;
    const { completed, label } = event.body;
    const getItemParams = {
        "Key": {
            'id': todoItemId,
        },
    };
    const todoItem = await (0, common_1.getItem)(getItemParams, process.env.DDB_TODO_TABLE, process.env.AWS_REGION);
    if (typeof todoItem === `undefined`) {
        throw new common_1.NotFoundError(`Todo item ${todoItemId} not found.`);
    }
    else if (todoItem.deletedAt !== null) {
        throw new common_1.InvalidRequestError(`Todo item ${todoItemId} deleted.`);
    }
    const updateParams = {
        "ExpressionAttributeValues": {
            ':completed': completed,
            ':label': label,
            ':updatedAt': new Date().getTime(),
        },
        "Key": {
            "id": todoItemId,
        },
        "ReturnValues": `ALL_NEW`,
        "UpdateExpression": `SET completed = :completed, label = :label, updatedAt = :updatedAt`,
    };
    const response = await (0, common_1.updateItem)(updateParams, process.env.DDB_TODO_TABLE, process.env.AWS_REGION);
    return { "body": response };
};
module.exports.handler = (0, common_1.gatewayLambdaWrapper)(main, validator);
