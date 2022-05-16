# Todo Item Service


## Assumptions
- For the delete of todo item, we are doing soft delete in database for fututre audit purpose. So setting `deletedAt` while invoking delete API.


### To setup in local

* Install node js (v14.16.0+)
* Run: git clone https://github.com/ashishrajagrawal91/lambda-api.git
* Run: npm install


### To run eslint and fix error

* Run: npm run lint
* Run: npm run lint:fix


### API Details


#### Create todo item API
https://buyqnpot4m.execute-api.eu-west-2.amazonaws.com/develop/todoItem
#### Method
POST
#### Request Body
| Input | Type | Required |
| --- | ----------- | ----------- |
| completed | Boolean | Required |
| label | Text | Required |
#### Request Header
- application/json
#### Response
```json
{
    "completed": false,
    "deletedAt": null,
    "createdAt": 1652652329509,
    "updatedAt": null,
    "label": "go to gym",
    "status": "OK",
    "id": "6af5f1b7-eca9-41a8-adee-0a9c9d206327"
}
```


#### Get todo item API
https://buyqnpot4m.execute-api.eu-west-2.amazonaws.com/develop/todoItem/{todoItemId}
#### Method
GET
#### Request Header
- application/json
#### Response
```json
{
    "completed": false,
    "deletedAt": null,
    "createdAt": 1652652329509,
    "updatedAt": null,
    "label": "go to gym",
    "status": "OK",
    "id": "6af5f1b7-eca9-41a8-adee-0a9c9d206327"
}
```


#### DELETE todo item API
https://buyqnpot4m.execute-api.eu-west-2.amazonaws.com/develop/todoItem/{todoItemId}
#### Method
DELETE
#### Request Header
- application/json
#### Response
```json
{
    "message": "Todo item deleted successfully."
}
```


#### Update todo item API
https://buyqnpot4m.execute-api.eu-west-2.amazonaws.com/develop/todoItem/{todoItemId}
#### Method
PUT
#### Request Body
| Input | Type | Required |
| --- | ----------- | ----------- |
| completed | Boolean | Required |
| label | Text | Required |
#### Request Header
- application/json
#### Response
```json
{
    "completed": false,
    "deletedAt": null,
    "createdAt": 1652652329509,
    "updatedAt": null,
    "label": "go to gym",
    "status": "OK",
    "id": "6af5f1b7-eca9-41a8-adee-0a9c9d206327"
}
```


#### List todo item API without Limit and Offset (default Limit is 5)
https://buyqnpot4m.execute-api.eu-west-2.amazonaws.com/develop/todoItem
#### Method
GET
#### Request Header
- application/json
#### Response
```json
{
    "Count": 5,
    "Items": [
        {
            "completed": false,
            "deletedAt": null,
            "updatedAt": null,
            "status": "OK",
            "label": "call mom",
            "createdAt": 1652690677818,
            "id": "13bbd42d-807c-4ca5-b599-1b4357cae1eb"
        },
        {
            "completed": false,
            "deletedAt": null,
            "updatedAt": null,
            "status": "OK",
            "label": "get cake from shop",
            "createdAt": 1652690658551,
            "id": "80c99a03-5cea-4cad-9e4a-7af2096c246d"
        },
        {
            "completed": false,
            "deletedAt": null,
            "updatedAt": null,
            "status": "OK",
            "label": "pickup kids from school",
            "createdAt": 1652690635229,
            "id": "156b77cd-fe60-4e08-a9b2-071ea2e1a068"
        },
        {
            "completed": false,
            "deletedAt": null,
            "updatedAt": null,
            "status": "OK",
            "label": "take marshall outside",
            "createdAt": 1652690619295,
            "id": "c4c37f77-16e5-4272-b1de-7299963229e4"
        },
        {
            "completed": false,
            "deletedAt": null,
            "updatedAt": null,
            "status": "OK",
            "label": "attend townhall",
            "createdAt": 1652690603855,
            "id": "b0ee4a04-51a9-417a-b8db-caa92969da63"
        }
    ],
    "LastEvaluatedKey": {
        "id": "b0ee4a04-51a9-417a-b8db-caa92969da63",
        "createdAt": 1652690603855,
        "status": "OK"
    }
}
```


#### List todo item API with Limit and Offset
https://buyqnpot4m.execute-api.eu-west-2.amazonaws.com/develop/todoItem?id=b0ee4a04-51a9-417a-b8db-caa92969da63&createdAt=1652690603855&status=OK&limit=5
#### Method
GET
#### Request Header
- application/json
#### Response
```json
{
    "Count": 1,
    "Items": [
        {
            "completed": true,
            "deletedAt": 1652690485694,
            "updatedAt": 1652690479900,
            "status": "OK",
            "label": "go to gym",
            "createdAt": 1652690380041,
            "id": "4a954f21-c681-464f-a0d5-72976d67a8b3"
        }
    ]
}
```


### Response Codes 
#### Response Codes
```
200: Success
400: Bad request
404: Cannot be found
204: No Content Found
500: Internal Server Error
```
#### Error Codes Details
```
400: InvalidRequestError
404: NotFoundError
204: NoContentError
500: InternalServerError
```
#### Example Error Message
```json
http code 400
{
    "statusCode": 400,
    "errorName": "InvalidRequestError",
    "errorMessage": "[\"\\\"body.completed\\\" must be a boolean\"]"
}
```