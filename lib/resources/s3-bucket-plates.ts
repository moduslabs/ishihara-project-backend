import { Stack } from "aws-cdk-lib";
import { Bucket, BucketAccessControl, HttpMethods } from "aws-cdk-lib/aws-s3";
import { getNamespace, getResourceName } from "../util";

export function getBucketImage(stack: Stack) {
  return new Bucket(stack, getResourceName("bucket-ishihara"), {
    accessControl: BucketAccessControl.PRIVATE,
    cors: [
      {
        allowedOrigins: ["*"],
        allowedMethods: [HttpMethods.GET],
      },
    ],
    bucketName: `ishihara-${getNamespace()}`,
  });
}
