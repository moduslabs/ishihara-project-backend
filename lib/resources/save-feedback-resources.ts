/* create cdk resources for feedback feature (lambda and dynamodb table) */

import { Table, TableProps } from "aws-cdk-lib/aws-dynamodb";
import {
  Function,
  FunctionProps,
  Runtime,
  Code,
} from "aws-cdk-lib/aws-lambda";
import { Construct } from "constructs";
import { getNamespace } from "../util";
import { AttributeType } from "aws-cdk-lib/aws-dynamodb";

import { Bucket, BucketAccessControl, HttpMethods } from "aws-cdk-lib/aws-s3";


export function getFeedbackTable(scope: Construct, props?: TableProps): Table {
  return new Table(scope, `FeedbackTable${getNamespace()}`, {
    partitionKey: {
      name: "id",
      type: AttributeType.STRING,
    },
    ...props,
  });
}

export function getLambdaApiSaveFeedback(
  scope: Construct,
  //optional 
  props?: Partial<FunctionProps>
): Function {
  return new Function(scope, `LambdaApiSaveFeedback${getNamespace()}`, {
    runtime: Runtime.NODEJS_14_X,
    handler: "saveFeedback.handler",
    code: Code.fromAsset("lambdas/feedback"),
    ...props,
  });
}
