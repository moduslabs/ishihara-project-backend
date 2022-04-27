import { Stack } from "aws-cdk-lib";
import { Bucket, BucketAccessControl, HttpMethods } from "aws-cdk-lib/aws-s3";
import { getLogicalId, getNamespace } from "../util";

export function getBucketImage(stack: Stack) {
  return new Bucket(stack, getLogicalId("bucket-ishihara"), {
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
