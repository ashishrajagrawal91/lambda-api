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
        "queryStringParameters": Joi.object({
            "createdAt": Joi.number().optional(),
            "id": Joi.string().optional(),
            "limit": Joi.number().positive().max(100).optional(),
            "status": Joi.string().optional(),
        }),
    }).unknown(true);
    return schema.validate(event);
};
const main = async (event) => {
    const { limit, id, createdAt, status } = event.queryStringParameters;
    let ExclusiveStartKey = null;
    if (typeof id !== `undefined` &&
        typeof createdAt !== `undefined` &&
        typeof status !== `undefined`) {
        ExclusiveStartKey = {
            "createdAt": parseInt(createdAt, 10),
            "id": id,
            "status": status,
        };
    }
    const params = {
        "ExclusiveStartKey": ExclusiveStartKey,
        "ExpressionAttributeNames": {
            "#item_status": `status`,
        },
        "ExpressionAttributeValues": {
            ":s": `OK`,
        },
        "IndexName": `StatusCreatedAtIndex`,
        "KeyConditionExpression": ` #item_status = :s `,
        "Limit": typeof limit === `undefined` ? 5 : parseInt(limit, 10),
        "ScanIndexForward": false,
    };
    const response = await (0, common_1.queryItem)(params, process.env.DDB_TODO_TABLE, process.env.AWS_REGION);
    return { "body": response };
};
module.exports.handler = (0, common_1.gatewayLambdaWrapper)(main, validator);
