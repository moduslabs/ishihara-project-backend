/* Lambda function to save feedback to DynamoDB */
import { APIGatewayProxyHandler } from "aws-lambda";
import { DynamoDB} from "aws-sdk";
import * as uuid from "uuid";


const dynamoDb = new DynamoDB.DocumentClient();

export const handler: APIGatewayProxyHandler = async (event) => {
  const data = JSON.parse(event.body!);

  const params = {
    TableName: process.env.TABLE_NAME!,
    Item: {
      id: uuid.v4(),
      name: data.name,
      email: data.email,
      message: data.message,
      createdAt: new Date().toISOString(),
    },
  };

  await dynamoDb.put(params).promise();

  return {
    statusCode: 200,
    body: JSON.stringify(params.Item),
  };
};
