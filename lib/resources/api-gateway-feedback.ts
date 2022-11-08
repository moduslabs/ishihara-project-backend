/* createFeedbackGatewayApi similar to createAPIGateway */

import { Stack } from "aws-cdk-lib";
import { LambdaRestApi, RestApi, SecurityPolicy } from "aws-cdk-lib/aws-apigateway";
import {ICertificate} from "aws-cdk-lib/aws-certificatemanager";
import { NodejsFunction } from "aws-cdk-lib/aws-lambda-nodejs";
import { getFeedbackDomain, getNamespace, getResourceName } from "../util";

export function createFeedbackGatewayApi(
  stack: Stack,
  certificate: ICertificate,
  lambdaFunction: NodejsFunction) : RestApi {
  const apiGateway = new LambdaRestApi(
    stack,
    getResourceName("api-gateway-ishihara-feedback"),
    {
      handler: lambdaFunction,
      domainName: {
        domainName: getFeedbackDomain(),
        certificate,
        securityPolicy: SecurityPolicy.TLS_1_2,
      },
      proxy: false,
      deployOptions: {
        stageName: getNamespace(),
      },
    }
  );

  apiGateway.root.addMethod("POST");
  apiGateway.root.addCorsPreflight({
    allowOrigins: ["*"],
    allowMethods: ["POST"],
    });

  return apiGateway;
}
