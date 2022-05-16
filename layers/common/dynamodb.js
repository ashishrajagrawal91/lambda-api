"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.queryItem = exports.getItem = exports.updateItem = exports.createItem = void 0;
const client_dynamodb_1 = require("@aws-sdk/client-dynamodb");
const util_dynamodb_1 = require("@aws-sdk/util-dynamodb");
const errors_1 = require("./errors");
const createItem = async (query, tableName, region) => {
    const client = new client_dynamodb_1.DynamoDBClient({
        "region": region,
    });
    query.Item = (0, util_dynamodb_1.marshall)(query.Item);
    const command = new client_dynamodb_1.PutItemCommand({
        ...query, "TableName": tableName,
    });
    const response = await client.send(command);
    return response;
};
exports.createItem = createItem;
const updateItem = async (query, tableName, region) => {
    const client = new client_dynamodb_1.DynamoDBClient({
        "region": region,
    });
    query.ExpressionAttributeValues = (0, util_dynamodb_1.marshall)(query.ExpressionAttributeValues);
    query.Key = (0, util_dynamodb_1.marshall)(query.Key);
    const command = new client_dynamodb_1.UpdateItemCommand({
        ...query, "TableName": tableName,
    });
    const { Attributes } = await client.send(command);
    if (typeof Attributes === `undefined`) {
        throw new errors_1.NotFoundError(`Todo item not found.`);
    }
    return (0, util_dynamodb_1.unmarshall)(Attributes);
};
exports.updateItem = updateItem;
const getItem = async (query, tableName, region) => {
    const client = new client_dynamodb_1.DynamoDBClient({
        "region": region,
    });
    query.Key = (0, util_dynamodb_1.marshall)(query.Key);
    const command = new client_dynamodb_1.GetItemCommand({
        ...query, "TableName": tableName,
    });
    const response = await client.send(command);
    if (typeof response.Item === `undefined`) {
        throw new errors_1.NotFoundError(`Todo item not found.`);
    }
    return (0, util_dynamodb_1.unmarshall)(response.Item);
};
exports.getItem = getItem;
const queryItem = async (query, tableName, region) => {
    const client = new client_dynamodb_1.DynamoDBClient({
        "region": region,
    });
    query.ExpressionAttributeValues = (0, util_dynamodb_1.marshall)(query.ExpressionAttributeValues);
    if (query.ExclusiveStartKey !== null) {
        query.ExclusiveStartKey = (0, util_dynamodb_1.marshall)(query.ExclusiveStartKey);
    }
    const command = new client_dynamodb_1.QueryCommand({
        ...query, "TableName": tableName,
    });
    const response = await client.send(command);
    console.log(`response `, response);
    if (typeof response.Items === `undefined`) {
        throw new errors_1.NotFoundError(`Todo item not found.`);
    }
    response.Items = response.Items.map((obj) => {
        return (0, util_dynamodb_1.unmarshall)(obj);
    });
    if (response.LastEvaluatedKey) {
        response.LastEvaluatedKey = (0, util_dynamodb_1.unmarshall)(response.LastEvaluatedKey);
    }
    return {
        "Count": response.Count,
        "Items": response.Items,
        "LastEvaluatedKey": response.LastEvaluatedKey,
    };
};
exports.queryItem = queryItem;
