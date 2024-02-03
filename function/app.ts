import { APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda';
import { CognitoIdentityProviderClient, SignUpCommand,AdminConfirmSignUpCommand } from "@aws-sdk/client-cognito-identity-provider";
import * as AmazonCognitoIdentity from 'amazon-cognito-identity-js';

const USER_POOL_ID = process.env.USER_POOL_ID
const USER_POOL_CLIENT_ID = process.env.USER_POOL_CLIENT_ID
export const register = async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
    try {
        console.log({ USER_POOL_CLIENT_ID });
        console.log({ USER_POOL_ID });
        const body = JSON.parse(event.body || '{}');
        const requiredFields = ['email', 'given_name', 'family_name','password'];
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
        const { email, given_name, family_name,password } = body;
        // check email is valid
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            return {
                statusCode: 400,
                body: JSON.stringify({ error: `Invalid email` }),
                multiValueHeaders: {
                    'Access-Control-Allow-Origin': ['*'],
                }
            }
        }
       
        
        const client = new CognitoIdentityProviderClient();
        const input = {
            ClientId: USER_POOL_CLIENT_ID,
            Password: password,
            Username: email,
            UserAttributes: [
                {
                    Name: 'email',
                    Value: email
                },
                {
                    Name: 'given_name',
                    Value: given_name
                },
                {
                    Name: 'family_name',
                    Value: family_name
                }
            ]
        };
        const command = new SignUpCommand(input);
        await client.send(command);
        const confirmEmailInput = { 
            UserPoolId: USER_POOL_ID, 
            Username: email
        };
        const confirmEmailCommand = new AdminConfirmSignUpCommand(confirmEmailInput);
        await client.send(confirmEmailCommand);
        return {
            statusCode: 200,
            body: JSON.stringify({
                message: `User ${email} created successfully`,
            }),
        };
    } catch (err) {
        console.log(err);
        return {
            statusCode: 500,
            body: JSON.stringify({
                message: 'some error happened',
            }),
        };
    }
};
export const login = async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
    try {
        console.log('Entering login function');

        const body = JSON.parse(event.body || '{}');
        console.log('Request body:', body);

        const { email, password } = body;
        const authenticationData = {
            Username: email,
            Password: password,
        };
        const authenticationDetails = new AmazonCognitoIdentity.AuthenticationDetails(authenticationData);
        const poolData = {
            UserPoolId: "us-east-1_7aWuYWReN",
            ClientId: "5rg6qkvdt68r62booo7cu2efje",
        };
        const userPool = new AmazonCognitoIdentity.CognitoUserPool(poolData);
        const userData = {
            Username: email,
            Pool: userPool,
        };
        const cognitoUser = new AmazonCognitoIdentity.CognitoUser(userData);

        console.log('Before authenticateUser promise');

        // Use promisify to convert authenticateUser to a promise
        const authenticateUser = (): Promise<any> => {
            return new Promise((resolve, reject) => {
                console.log('Inside authenticateUser promise');
                cognitoUser.authenticateUser(authenticationDetails, {
                    onSuccess: (result) => {
                        console.log('Authentication successful:', result);
                        resolve(result);
                    },
                    onFailure: (err) => {
                        console.error('Authentication failed:', err);
                        reject(err);
                    },
                });
            });
        };

        console.log('After authenticateUser promise');

        // Use await to wait for the asynchronous operation to complete
        await authenticateUser();

        console.log('Exiting login function successfully');

        return {
            statusCode: 200,
            body: JSON.stringify({
                message: 'Success',
            }),
        };
    } catch (err) {
        console.error('An error occurred:', err);

        return {
            statusCode: 500,
            body: JSON.stringify({
                message: `Error: ${err}`,
            }),
        };
    }
};