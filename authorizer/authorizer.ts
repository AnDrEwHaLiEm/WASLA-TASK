import { APIGatewayTokenAuthorizerEvent, APIGatewayAuthorizerResult } from "aws-lambda";
import { CognitoJwtVerifier } from "aws-jwt-verify";

const USER_POOL_ID = process.env.USER_POOL_ID
const USER_POOL_CLIENT_ID = process.env.USER_POOL_CLIENT_ID
export const handler = async (event: APIGatewayTokenAuthorizerEvent): Promise<APIGatewayAuthorizerResult> => {
    try {
        const token = event.authorizationToken.split(' ')[1];
        if (!token) {
            return {
                principalId: "user",
                policyDocument: {
                    Version: "2012-10-17",
                    Statement: [
                        {
                            Action: "execute-api:Invoke",
                            Effect: "Deny",
                            Resource: "*"
                        }
                    ]
                }
            }
        }
    
        const verifier = CognitoJwtVerifier.create({
            userPoolId: USER_POOL_ID as string,
            clientId: USER_POOL_CLIENT_ID as string,
            tokenUse: "id"
        });
        const claims = await verifier.verify(token);
        console.log("claims", claims);
        return {
            principalId: "user",
            policyDocument: {
                Version: "2012-10-17",
                Statement: [
                    {
                        Action: "execute-api:Invoke",
                        Effect: "Allow",
                        Resource: "*"
                    }
                ]
            },
            context: {
                user_id: claims.sub,
            }
        }
    } catch (error) {
        console.error(error);
        return {
            principalId: "user",
            policyDocument: {
                Version: "2012-10-17",
                Statement: [
                    {
                        Action: "execute-api:Invoke",
                        Effect: "Deny",
                        Resource: "*"
                    }
                ]
            }
        }
    }
}