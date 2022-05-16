import * as Joi from "joi";
import { NotFoundError, gatewayLambdaWrapper, getItem } from "common";

const validator = (event: any) => {
	const schema = Joi.object({
		"pathParameters": Joi.object({
			"todoItemId": Joi.string().uuid({ "version": `uuidv4` }).required(),
		}),
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

	if (typeof todoItem === `undefined`) {
		throw new NotFoundError(`Todo item ${todoItemId} not found.`);
	}

	return { "body": todoItem };
};

module.exports.handler = gatewayLambdaWrapper(main, validator);
