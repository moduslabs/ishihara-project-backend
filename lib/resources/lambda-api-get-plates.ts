import { Duration, Stack } from "aws-cdk-lib";
import { Code, Function, Runtime } from "aws-cdk-lib/aws-lambda";
import { join } from "path";
import { getNamespace } from "../util";

export function getLambdaSimpleApi(stack: Stack) {
  return new Function(stack, "lambda-get-plates", {
    runtime: Runtime.NODEJS_14_X,
    timeout: Duration.seconds(30),
    handler: "src/index.handler",
    code: Code.fromAsset(join(__dirname, "..", "..", "lambdas", "api")),
    environment: {
      BUCKET_S3: `ishihara-${getNamespace()}`,
    },
  });
}
