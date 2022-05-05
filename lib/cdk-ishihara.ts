import "source-map-support/register";
import * as cdk from "aws-cdk-lib";

import { DefaultStackSynthesizer, Stack, StackProps } from "aws-cdk-lib";
import { Construct } from "constructs";
import { getBucketImage } from "./resources/s3-bucket-plates";
import { getLambdaSimpleApi } from "./resources/lambda-api-get-plates";
import { createAPIGateway } from "./resources/api-gateway-get-plates";
import { configureEventBridgeCron } from "./resources/cron-plate-generator";
import { getLambdaPlateGenerator } from "./resources/lambda-plate-generator";
import { capitalize, getNamespace } from "./util";

export class CdkIshiharaStack extends Stack {
  constructor(scope: Construct, id: string, props?: StackProps) {
    super(scope, id, props);

    const bucket = getBucketImage(this);
    const plateGenerator = getLambdaPlateGenerator(this);
    bucket.grantPut(plateGenerator);
    bucket.grantPutAcl(plateGenerator);

    const getPlates = getLambdaSimpleApi(this);
    bucket.grantRead(getPlates);

    createAPIGateway(this, getPlates);
    configureEventBridgeCron(this, plateGenerator);
  }
}

const app = new cdk.App();
new CdkIshiharaStack(app, `CdkIshiharaStack${capitalize(getNamespace())}`, {
  synthesizer: new cdk.DefaultStackSynthesizer({
    qualifier: process.env.QUALIFIER || 'local',
  }),
});
