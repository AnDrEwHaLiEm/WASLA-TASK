# Your Serverless Application

This is a Serverless application built using AWS SAM. The project includes Lambda functions, a DynamoDB table, and an API Gateway.

## Prerequisites

Before you begin, ensure you have the following installed:

- [AWS CLI](https://aws.amazon.com/cli/)
- [AWS SAM CLI](https://docs.aws.amazon.com/serverless-application-model/latest/developerguide/serverless-sam-cli-install.html)
- [Node.js](https://nodejs.org/)
- [Docker](https://www.docker.com/)

## How to Run Locally
1. Navigate to the root directory and run:

    ```bash
    npm install
    ```

2. Navigate to `./Layers/nodejs` and run:

    ```bash
    npm install
    ```

3. Run the project locally:

    ```bash
    npm start
    ```

   This command builds the project using SAM and starts the local API Gateway.

## How to Deploy
To deploy the application, run:

```bash
npm run deploy
```
This command builds and deploys the application to AWS.

## Project Structure
- Lambda Functions: The project includes six Lambda functions:

* register: Handles user registration ,login
* createTask, getUserTasks, updateTask, deleteTask: Implement CRUD operations on tasks.
* Authorizer: The application uses Cognito User Pool for Lambda authorizer.
* DynamoDB Table: The DynamoDB table named taskTable stores task information.
## API Endpoints
### Register User
* method: POST
* endpoint: register
* body : `{
    "email": "user@example.com",
    "given_name": "andrew",
    "family_name": "haliem",
    "password": "your_password"
}`

### login User
* method: POST
* endpoint: login
* body : `{
    "email": "user@example.com",
    "password": "your_password"
}`
* response body : `{
  {
    "message": {
        "$metadata": {
            "httpStatusCode": 200,
            "requestId": "5993b05b-0f8a-4da6-a1b0-ca2e235bafb2",
            "attempts": 1,
            "totalRetryDelay": 0
        },
        "AuthenticationResult": {
            "AccessToken": {AccessToken},
            "ExpiresIn": 3600,
            "IdToken": {IdToken}, // use this for user token
            "RefreshToken": {RefreshToken},
            "TokenType": "Bearer"
        },
        "ChallengeParameters": {}
    }
  }`

### create task
* method: POST
* endpoint: task
* body : `{
    "title": "Task Title",
    "description": "Task Description"
}`
* header : Authorization=Bearer ${user_token}

### get All user tasks
* method: GET
* endpoint: task
* header : Authorization=Bearer ${user_token}

### update task
* method: PUT
* endpoint: task/{task_id}
* body : `{
    "title": "Task Title",
    "description": "Task Description"
}`
* header : Authorization=Bearer ${user_token}

### delete task
* method: delete
* endpoint: task/{task_id}
* header : Authorization=Bearer ${user_token}

## Postman Apis
 - [Api documentation](https://documenter.getpostman.com/view/27394446/2s9YywdJcY/)
  
## Note

* environment variables like userPoolId and clientId will assign automatically after deployment and work correctly in deployment but in case run locally in many device you should change variables manually

* change endpoint you will find in postman to your new endpoint 
```
https://eiv0mv5dlj.execute-api.us-east-1.amazonaws.com => your new endpoint will find it in output section after deploy
```