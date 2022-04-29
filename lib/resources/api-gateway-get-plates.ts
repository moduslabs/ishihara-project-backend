import { Stack } from "aws-cdk-lib";
import { LambdaRestApi } from "aws-cdk-lib/aws-apigateway";
import { NodejsFunction } from "aws-cdk-lib/aws-lambda-nodejs";
import { getLogicalId, getNamespace } from "../util";

export function createAPIGateway(stack: Stack, lambdaFunction: NodejsFunction) {
  const apiGateway = new LambdaRestApi(
    stack,
    getLogicalId("api-gateway-ishihara"),
    {
      handler: lambdaFunction,
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
}
