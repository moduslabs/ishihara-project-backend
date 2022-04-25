import { Stack } from "aws-cdk-lib";
import { Code, Function, Runtime } from "aws-cdk-lib/aws-lambda";
import { join } from "path";
import { getLogicalId, getNamespace } from "../util";

export function getLambdaPlateGenerator(stack: Stack) {
  return new Function(stack, getLogicalId("lambda-plate-generator"), {
    runtime: Runtime.NODEJS_14_X,
    handler: "src/index.handler",
    code: Code.fromAsset(
      join(__dirname, "..", "..", "lambdas", "algorithm")
    ),
    environment: {
      BUCKET_S3: `ishihara-${getNamespace()}`,
      FONTCONFIG_PATH: "/var/task/algorithm/fonts",
      LD_PRELOAD:
        "/var/task/algorithm/node_modules/canvas/build/Release/libz.so.1",
      LD_LIBRARY_PATH: "$LD_LIBRARY_PATH:/var/task/algorithm/lib",
    },
  });
}
