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
		"pathParameters": Joi.object({
			"todoItemId": Joi.string().uuid({ "version": `uuidv4` }).required(),
		}),
		"queryStringParameters": Joi.object({}),
	}).unknown(true);

	return schema.validate(event);
};

const main = async(event: any) => {
	const { todoItemId } = event.pathParameters;

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

	console.log(`delete_todo_item todoItem get `, todoItem);

	if (typeof todoItem === `undefined`) {
		throw new NotFoundError(`Todo item ${todoItemId} not found.`);
	} else if (todoItem.deletedAt !== null) {
		throw new InvalidRequestError(`Todo item ${todoItemId} already deleted.`);
	}

	const deleteParams = {
		"ExpressionAttributeValues": {
			":deletedAt": new Date().getTime(),
		},
		"Key": {
			"id": todoItemId,
		},
		"ReturnValues"     : `ALL_NEW`,
		"UpdateExpression" : `set deletedAt = :deletedAt`,
	};

	await updateItem(deleteParams, process.env.DDB_TODO_TABLE, process.env.AWS_REGION);

	return { "body": {"message": `Todo item deleted successfully.`} };
};

module.exports.handler = gatewayLambdaWrapper(main, validator);
