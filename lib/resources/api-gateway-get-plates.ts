import { Stack } from "aws-cdk-lib";
import { LambdaRestApi, RestApi, SecurityPolicy } from "aws-cdk-lib/aws-apigateway";
import {ICertificate} from "aws-cdk-lib/aws-certificatemanager";
import { NodejsFunction } from "aws-cdk-lib/aws-lambda-nodejs";
import { getAPIDomain, getNamespace, getResourceName } from "../util";

export function createAPIGateway(
  stack: Stack,
  certificate: ICertificate,
  lambdaFunction: NodejsFunction) : RestApi {
  const apiGateway = new LambdaRestApi(
    stack,
    getResourceName("api-gateway-ishihara"),
    {
      handler: lambdaFunction,
      domainName: {
        domainName: getAPIDomain(),
        certificate,
        securityPolicy: SecurityPolicy.TLS_1_2,
      },
      proxy: false,
      deployOptions: {
        stageName: getNamespace(),
      },
    }
  );

  const plates = apiGateway.root.addResource("plates");
  plates.addMethod("GET");
  plates.addCorsPreflight({
    allowOrigins: ["*"],
    allowMethods: ["GET"],
  });

  return apiGateway;
}
