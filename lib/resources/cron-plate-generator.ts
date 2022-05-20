import { Stack } from "aws-cdk-lib";
import { Rule, Schedule } from "aws-cdk-lib/aws-events";
import { LambdaFunction } from "aws-cdk-lib/aws-events-targets";
import { IFunction } from "aws-cdk-lib/aws-lambda";
import {getResourceName} from "../util";

export function configureEventBridgeCron(stack: Stack, lambda: IFunction) {
  return new Rule(stack, getResourceName("cron-plate-generator"), {
    schedule: Schedule.cron({}),
    targets: [new LambdaFunction(lambda)],
    enabled: false,
  });
}
