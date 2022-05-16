import { InvalidRequestError } from "./errors";

export const gatewayLambdaWrapper = (main: any, validator: any) => async(event: any) => {
	try {
		console.log(`common.utils.lambdaWrapper`, event);
		if (event.body && event.headers[`Content-Type`] === `application/json`) {
			event.body = JSON.parse(event.body); //eslint-disable-line require-atomic-updates
		}
		// eslint-disable-next-line require-atomic-updates
		event.queryStringParameters = event.queryStringParameters || {};

		if (typeof validator !== `undefined`) {
			const result = await validator(event);

			if (typeof result.error !== `undefined`) {
				const messages = result.error.details.map((e: any) => e.message);

				throw new InvalidRequestError(JSON.stringify(messages));
			}
		}

		const { body, isBase64Encoded, ...response } = await main(event);

		if (isBase64Encoded) {
			return { body, "isBase64Encoded": true, ...response };
		}
		return {
			"body"            : typeof body === `undefined` ? `{}` : JSON.stringify(body),
			"headers"         : { "Content-Type": `application/json` },
			"isBase64Encoded" : false,
			"statusCode"      : 200,
			...response,
		};
	} catch (e) {
		console.error(`common.utils.lambdaWrapper`, `executionError`, e);
		return {
			"body"            : JSON.stringify(e),
			"headers"         : { "Content-Type": `application/json` },
			"isBase64Encoded" : false,
			"statusCode"      : e.statusCode || 500,
		};
	}
};
