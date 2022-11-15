/* Lambda that returns a signed URL for uploading an image to S3.
* The frontend will use this URL to upload the image directly to S3.
* and store it with the feedback form data.
*/

import { APIGatewayProxyHandler, APIGatewayProxyEvent } from "aws-lambda";
import { S3 } from "aws-sdk";
import * as uuid from "uuid";

export const handler: APIGatewayProxyHandler = async (
  event: APIGatewayProxyEvent
) => {
  const s3 = new S3();
  const params = {
    Bucket: process.env.BUCKET_NAME!,
    Key: `${uuid.v4()}.jpeg`,
    ContentType: "image/jpeg",
  };

  const url = await s3.getSignedUrlPromise("putObject", params);

  return {
    statusCode: 200,
    body: JSON.stringify({ url }),
  };
}
