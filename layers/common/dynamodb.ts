import {
	DynamoDBClient,
	PutItemCommand,
	UpdateItemCommand,
	GetItemCommand,
	QueryCommand,
} from "@aws-sdk/client-dynamodb";
import { marshall, unmarshall } from "@aws-sdk/util-dynamodb";
import { NotFoundError } from "./errors";

export const createItem = async(query: any, tableName: string, region: string) =>{
	const client = new DynamoDBClient({
		"region": region,
	});

	query.Item = marshall(query.Item);
	const command = new PutItemCommand({
		...query, "TableName": tableName,
	});

	const response = await client.send(command);

	return response;
};

export const updateItem = async(query: any, tableName: string, region: string) =>{
	const client = new DynamoDBClient({
		"region": region,
	});

	query.ExpressionAttributeValues = marshall(query.ExpressionAttributeValues);
	query.Key = marshall(query.Key);
	const command = new UpdateItemCommand({
		...query, "TableName": tableName,
	});

	const { Attributes } = await client.send(command);

	if (typeof Attributes === `undefined`) {
		throw new NotFoundError(`Todo item not found.`);
	}

	return unmarshall(Attributes);
};

export const getItem = async(query: any, tableName: string, region: string) =>{
	const client = new DynamoDBClient({
		"region": region,
	});

	query.Key = marshall(query.Key);
	const command = new GetItemCommand({
		...query, "TableName": tableName,
	});

	const response = await client.send(command);

	if (typeof response.Item === `undefined`) {
		throw new NotFoundError(`Todo item not found.`);
	}

	return unmarshall(response.Item);
};

export const queryItem = async(query: any, tableName: string, region: string) =>{
	const client = new DynamoDBClient({
		"region": region,
	});

	query.ExpressionAttributeValues = marshall(query.ExpressionAttributeValues);
	if (query.ExclusiveStartKey !== null) {
		query.ExclusiveStartKey = marshall(query.ExclusiveStartKey);
	}
	const command = new QueryCommand({
		...query, "TableName": tableName,
	});

	const response = await client.send(command);

	console.log(`response `, response);
	if (typeof response.Items === `undefined`) {
		throw new NotFoundError(`Todo item not found.`);
	}

	response.Items = response.Items.map((obj)=> {
		return unmarshall(obj);
	});

	if (response.LastEvaluatedKey) {
		response.LastEvaluatedKey = unmarshall(response.LastEvaluatedKey);
	}
	return {
		"Count"            : response.Count,
		"Items"            : response.Items,
		"LastEvaluatedKey" : response.LastEvaluatedKey,
	};
};
