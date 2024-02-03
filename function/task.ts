import { APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda';
import { DynamoDBClient, PutItemCommand, UpdateItemCommand, ScanCommand, DeleteItemCommand, ReturnValue } from "@aws-sdk/client-dynamodb"; 

const TABLE_NAME = process.env.TABLE_NAME;

export const createTask = async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
    try {
        const user_id = event.requestContext.authorizer?.user_id || null;
        if (!user_id) {
            return {
                statusCode: 403,
                body: JSON.stringify({ error: 'Unauthorized' }),
                multiValueHeaders: {
                    'Access-Control-Allow-Origin': ['*'],
                }
            }
        }
        const body = JSON.parse(event.body || '{}');
        const requiredFields = ['title', 'description'];
        const missingFields = requiredFields.filter(field => !(field in body));
        if (missingFields.length > 0) {
            return {
                statusCode: 400,
                body: JSON.stringify({ error: `Missing required fields: ${missingFields.join(', ')}` }),
                multiValueHeaders: {
                    'Access-Control-Allow-Origin': ['*'],
                }
            }
        }
        const { title, description } = body;
        const client = new DynamoDBClient({});
        const input = {
            TableName: TABLE_NAME,
            Item: {
                _id: { S: Math.random().toString(36).substring(8) },
                user_id: { S: user_id },
                title: { S: title },
                description: { S: description },
            }
        };
        const command = new PutItemCommand(input);
        await client.send(command);
        return {
            statusCode: 201,
            body: JSON.stringify({ message: 'Task created' }),
            multiValueHeaders: {
                'Access-Control-Allow-Origin': ['*'],
            }
        }
    } catch (error) {
        console.error(error);
        return {
            statusCode: 500,
            body: JSON.stringify({ error: 'Internal server error' }),
            multiValueHeaders: {
                'Access-Control-Allow-Origin': ['*'],
            }
        }
    }
}

export const getUserTasks = async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
    try {
        const user_id = event.requestContext.authorizer?.user_id || null;
        if (!user_id) {
            return {
                statusCode: 403,
                body: JSON.stringify({ error: 'Unauthorized' }),
                multiValueHeaders: {
                    'Access-Control-Allow-Origin': ['*'],
                }
            }
        }
        const client = new DynamoDBClient({});
        const input = {
            TableName: TABLE_NAME,
            FilterExpression: "user_id = :user_id",
            ExpressionAttributeValues: {
                ":user_id": { S: user_id }
            }
        };
        const query = new ScanCommand(input);
        const { Items } = await client.send(query);
        const result = Items?.map(item => {
            return {
                _id: item._id.S,
                title: item.title.S,
                description: item.description.S,
            }
        });
        return {
            statusCode: 200,
            body: JSON.stringify({result}),
            multiValueHeaders: {
                'Access-Control-Allow-Origin': ['*'],
            }
        }
    } catch (error) {
        console.error(error);
        return {
            statusCode: 500,
            body: JSON.stringify({ error: 'Internal server error' }),
            multiValueHeaders: {
                'Access-Control-Allow-Origin': ['*'],
            }
        }
    }
}

export const updateTask = async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
    try {
        const user_id = event.requestContext.authorizer?.user_id || null;
        if (!user_id) {
            return {
                statusCode: 403,
                body: JSON.stringify({ error: 'Unauthorized' }),
                multiValueHeaders: {
                    'Access-Control-Allow-Origin': ['*'],
                }
            }
        }
        const _id = event.pathParameters?._id || null;
        const body = JSON.parse(event.body || '{}');
        const {title, description } = body;
        if (!_id) {
            return {
                statusCode: 400,
                body: JSON.stringify({ error: 'Missing _id' }),
                multiValueHeaders: {
                    'Access-Control-Allow-Origin': ['*'],
                }
            }
        }
        const client = new DynamoDBClient({});
        
        const input = {
            TableName: TABLE_NAME,
            Key: {
                _id: { S: _id }
            },
            UpdateExpression: 'SET #title = :title, #description = :description',
            ExpressionAttributeValues: {
                ':title': { S: title },
                ':description': { S: description }
            },
            ExpressionAttributeNames: {
                '#title': 'title',
                '#description': 'description',
            },
            ReturnValues: 'ALL_NEW' as ReturnValue
        };
        const query = new UpdateItemCommand(input);
        const result = await client.send(query);
        if (!result.Attributes) {
            return {
                statusCode: 404,
                body: JSON.stringify({ error: 'Task not found' }),
                multiValueHeaders: {
                    'Access-Control-Allow-Origin': ['*'],
                }
            }
        }
        
        return {
            statusCode: 200,
            body: JSON.stringify({ message: 'Task updated', result: result.Attributes }),
            multiValueHeaders: {
                'Access-Control-Allow-Origin': ['*'],
            }
        }
    } catch (error) {
        console.error(error);
        return {
            statusCode: 500,
            body: JSON.stringify({ error: 'Internal server error' }),
            multiValueHeaders: {
                'Access-Control-Allow-Origin': ['*'],
            }
        }
    }
}


export const deleteTask = async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
    try {
        const user_id = event.requestContext.authorizer?.user_id || null;
        if (!user_id) {
            return {
                statusCode: 403,
                body: JSON.stringify({ error: 'Unauthorized' }),
                multiValueHeaders: {
                    'Access-Control-Allow-Origin': ['*'],
                }
            }
        }
        const _id = event.pathParameters?._id || null;
        if (!_id) {
            return {
                statusCode: 400,
                body: JSON.stringify({ error: 'Missing _id' }),
                multiValueHeaders: {
                    'Access-Control-Allow-Origin': ['*'],
                }
            }
        }
        const client = new DynamoDBClient({});
        const input = {
            TableName: TABLE_NAME,
            Key: {
                _id: { S: _id }
            }
        };
        const query = new DeleteItemCommand(input);
        await client.send(query);
        return {
            statusCode: 200,
            body: JSON.stringify({ message: 'Task deleted' }),
            multiValueHeaders: {
                'Access-Control-Allow-Origin': ['*'],
            }
        }
    } catch (error) {
        console.error(error);
        return {
            statusCode: 500,
            body: JSON.stringify({ error: 'Internal server error' }),
            multiValueHeaders: {
                'Access-Control-Allow-Origin': ['*'],
            }
        }
    }
}