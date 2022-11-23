import "source-map-support/register";
import * as cdk from "aws-cdk-lib";

import { DefaultStackSynthesizer, Stack, StackProps } from "aws-cdk-lib";
import { Construct } from "constructs";
import { getBucketImage } from "./resources/s3-bucket-plates";
import { getLambdaSimpleApi } from "./resources/lambda-api-get-plates";
import {
  getLambdaApiSaveFeedback,
  getFeedbackTable,
  getUploadImageLambda,
  getFeedbackImageBucket,
} from "./resources/save-feedback-resources";
import { createAPIGateway } from "./resources/api-gateway-get-plates";
import { createFeedbackGatewayApi } from "./resources/api-gateway-feedback";
import { configureEventBridgeCron } from "./resources/cron-plate-generator";
import { getLambdaPlateGenerator } from "./resources/lambda-plate-generator";
import { capitalize, getNamespace } from "./util";
import { getHostedZone, getHostedZoneRecords } from "./resources/route-53";
import { getHTTPSCertificate } from "./resources/certificate-dns";

export class CdkIshiharaStack extends Stack {
  constructor(scope: Construct, id: string, props?: StackProps) {
    super(scope, id, props);

    const bucket = getBucketImage(this);
    const plateGenerator = getLambdaPlateGenerator(this);
    bucket.grantPut(plateGenerator);
    bucket.grantPutAcl(plateGenerator);

    const getPlates = getLambdaSimpleApi(this);
    bucket.grantRead(getPlates);

    //--- Fedback resources -----
    const feedbackTable = getFeedbackTable(this);
    const feedbackImageBucket = getFeedbackImageBucket(this);
    // Lambda used to generate signed url to upload image to s3
    const feedbackImageUploadUrlLambda = getUploadImageLambda(this, {
      environment: {
        BUCKET_NAME: feedbackImageBucket.bucketName,
      },
    });

    const feedbackLambda = getLambdaApiSaveFeedback(this, {
      environment: { TABLE_NAME: feedbackTable.tableName },
    });

    feedbackTable.grantReadWriteData(feedbackLambda);
    feedbackImageBucket.grantReadWrite(feedbackImageUploadUrlLambda);
    //--- End feedback resources -----
    configureEventBridgeCron(this, plateGenerator);

    const hostedZone = getHostedZone(this);
    const certificate = getHTTPSCertificate(this, hostedZone);
    const feedbackApi = createFeedbackGatewayApi(
      this,
      certificate,
      feedbackLambda
    );
    const api = createAPIGateway(this, certificate, getPlates);
    getHostedZoneRecords(this, hostedZone, api, feedbackApi);
  }
}

const app = new cdk.App();
new CdkIshiharaStack(app, `CdkIshiharaStack${capitalize(getNamespace())}`, {
  synthesizer: new cdk.DefaultStackSynthesizer({
    qualifier: process.env.QUALIFIER || "local",
  }),
});
