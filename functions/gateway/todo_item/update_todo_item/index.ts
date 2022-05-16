import * as Joi from "joi";
import {
	InvalidRequestError,
	NotFoundError,
	gatewayLambdaWrapper,
	updateItem,
	getItem,
} from "common";

const validator = (event: any) => {
	const schema = Joi.object({
		"body": Joi.object({
			"completed" : Joi.boolean().required(),
			"label"  	  : Joi.string().required(),
		}).unknown(true),
		"pathParameters": Joi.object({
			"todoItemId": Joi.string().uuid({ "version": `uuidv4` }).required(),
		}),
	}).unknown(true);

	return schema.validate(event);
};

const main = async(event: any) => {
	const { todoItemId } = event.pathParameters;
	const { completed, label } = event.body;

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

	if (typeof todoItem === `undefined`) {
		throw new NotFoundError(`Todo item ${todoItemId} not found.`);
	} else if (todoItem.deletedAt !== null) {
		throw new InvalidRequestError(`Todo item ${todoItemId} deleted.`);
	}

	const updateParams = {
		"ExpressionAttributeValues": {
			':completed' : completed,
			':label'     : label,
			':updatedAt' : new Date().getTime(),
		},
		"Key": {
			"id": todoItemId,
		},
		"ReturnValues"     : `ALL_NEW`,
		"UpdateExpression" : `SET completed = :completed, label = :label, updatedAt = :updatedAt`,
	};
	const response = await updateItem(
		updateParams,
		process.env.DDB_TODO_TABLE,
		process.env.AWS_REGION,
	);

	return { "body": response };
};

module.exports.handler = gatewayLambdaWrapper(main, validator);
