import { APIGatewayProxyHandler, APIGatewayProxyResult } from 'aws-lambda';
import { S3 } from "aws-sdk";
import * as uuid from "uuid";

export function getUploadURL() {
    const s3 = new S3();
    const bucket = "ishihara-app-uploads-stage";
    const key = uuid.v4();

    const params = {
        Expires: 60,
        Bucket: bucket,
        Conditions: [["content-length-range", 100, 10000000]], // 100Byte - 10MB
        ContentType: 'image/jpeg',
        // ACL: 'public-read'
    };

    try {
        const uploadURL = s3.getSignedUrl('putObject', params);
        console.log
        return {
            statusCode: 200,
            body: JSON.stringify({
                uploadURL: uploadURL,
                photoFilename: `${key}.jpg`
            })
        };

    } catch (err) {
        console.log(err);
        const message = `Error adding object ${key} to bucket ${bucket}. Make sure your bucket is in the same region as this function.`;
        console.log(message);
        throw new Error(message);
    }
};
