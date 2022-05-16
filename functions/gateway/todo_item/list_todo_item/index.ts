import * as Joi from "joi";
import { queryItem, gatewayLambdaWrapper } from "common";

const validator = (event: any) => {
	const schema = Joi.object({
		"queryStringParameters": Joi.object({
			"createdAt"	: Joi.number().optional(),
			"id"       	: Joi.string().optional(),
			"limit"   		: Joi.number().positive().max(100).optional(),
			"status"   	: Joi.string().optional(),
		}),
	}).unknown(true);

	return schema.validate(event);
};

const main = async(event: any) => {
	const { limit, id, createdAt, status } = event.queryStringParameters;
	let ExclusiveStartKey = null;

	if (typeof id !== `undefined` &&
		typeof createdAt !== `undefined` &&
		typeof status !== `undefined`) {
		ExclusiveStartKey = {
			"createdAt" : parseInt(createdAt, 10),
			"id"        : id,
			"status"    : status,
		};
	}

	const params = {
		"ExclusiveStartKey"        : ExclusiveStartKey,
		"ExpressionAttributeNames" : {
			"#item_status": `status`,
		},
		"ExpressionAttributeValues": {
			":s": `OK`,
		},
		"IndexName"              : `StatusCreatedAtIndex`,
		"KeyConditionExpression" : ` #item_status = :s `,
		"Limit"                  : typeof limit === `undefined` ? 5 : parseInt(limit, 10),
		"ScanIndexForward"       : false,
	};
	const response = await queryItem(params, process.env.DDB_TODO_TABLE, process.env.AWS_REGION);

	return { "body": response };
};

module.exports.handler = gatewayLambdaWrapper(main, validator);
