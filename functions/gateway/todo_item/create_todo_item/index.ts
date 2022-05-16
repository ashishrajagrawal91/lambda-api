import * as Joi from "joi";
import { createItem, gatewayLambdaWrapper, getItem } from "common";
import { v4 as uuid } from 'uuid';

export const validator = (event: any) => {
	const schema = Joi.object({
		"body": Joi.object({
			"completed" : Joi.boolean().required(),
			"label"  	  : Joi.string().required(),
		}).unknown(true),
	}).unknown(true);

	return schema.validate(event);
};

export const main = async(event: any) => {
	const postData = event.body;
	const todoItemId = uuid();

	const params = {
		"Item": {
			"completed" : postData.completed,
			"createdAt" : new Date().getTime(),
			"deletedAt" : null as any,
			"id"        : todoItemId,
			"label"     : postData.label,
			"status"   	: `OK`,
			"updatedAt" : null as any,
		},
	};

	await createItem(params, process.env.DDB_TODO_TABLE, process.env.AWS_REGION);

	const getItemParams = {
		"Key": {
			'id': todoItemId,
		},
	};
	const todoItem = await getItem(
		getItemParams,
		process.env.DDB_TODO_TABLE,
		process.env.AWS_REGION,
	);

	console.log(`create_todo_item todoItem get `, todoItem);
	return { "body": todoItem };
};

export const handler = gatewayLambdaWrapper(main, validator);
