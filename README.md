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
- Lambda Functions: The project includes five Lambda functions:

* register: Handles user registration.
* createTask, getUserTasks, updateTask, deleteTask: Implement CRUD operations on tasks.
* login: A function for obtaining a user's JWT token (intended for testing purposes and should be handled on the frontend in a real-world scenario).
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

## Note
* The login function is intended for testing purposes only and is not recommended for deployment in a real-world scenario. User authentication should be handled on the frontend.
* you must change userPoolId and ClientId to the new value in login function 
* environment variables like userPoolId and clientId will assign automatically after deployment and work correctly in deployment but in case run locally in many device you should change variables manually
