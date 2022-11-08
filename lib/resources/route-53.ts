import { Stack } from "aws-cdk-lib";
import { RestApi } from "aws-cdk-lib/aws-apigateway";
import {
  ARecord,
  HostedZone,
  IHostedZone,
  RecordTarget,
} from "aws-cdk-lib/aws-route53";
import { ApiGateway } from "aws-cdk-lib/aws-route53-targets";
import { getAPIDomain,getFeedbackDomain,  getCdkConfiguration, getResourceName } from "../util";

export interface NetworkSchema {
  hostedZone: IHostedZone;
  apiARecord: ARecord;
  feedbackARecord: ARecord;
}

export function getHostedZone(stack: Stack): IHostedZone {
  const { zoneName, hostedZoneId } = getCdkConfiguration();
  return HostedZone.fromHostedZoneAttributes(
    stack,
    getResourceName("hosted-zone"),
    {
      zoneName,
      hostedZoneId,
    }
  );
}

export function getHostedZoneRecords(
  stack: Stack,
  hostedZone: IHostedZone,
  restApi: RestApi,
  feedbackApi: RestApi,
): NetworkSchema {
  const apiDomain = getAPIDomain();
  const feedbackDomain = getFeedbackDomain();

  const apiARecord = new ARecord(stack, getResourceName("rest-api-arecord"), {
    recordName: apiDomain,
    target: RecordTarget.fromAlias(new ApiGateway(restApi)),
    zone: hostedZone,
  });

  const feedbackARecord = new ARecord(stack, getResourceName("feedback-api-arecord"), {
    recordName: feedbackDomain,
    target: RecordTarget.fromAlias(new ApiGateway(feedbackApi)),
    zone: hostedZone,
  });



  console.info("RestAPI: ", apiDomain);
  console.info("FeedbackAPI: ", feedbackDomain);

  return {
    hostedZone,
    apiARecord,
    feedbackARecord,
  };
}

