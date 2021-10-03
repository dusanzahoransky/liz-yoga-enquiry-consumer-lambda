import * as core from "@aws-cdk/core"
import * as lambda from "@aws-cdk/aws-lambda"
import * as s3 from "@aws-cdk/aws-s3"
import * as iam from "@aws-cdk/aws-iam"

export class EnquiryConsumerConstruct extends core.Construct {

    private enquiryTableStreamArn = 'arn:aws:dynamodb:ap-southeast-2:564737888276:table/Enquiry/stream/2021-10-03T11:09:26.179'

    constructor(scope: core.Construct, id: string) {
        super(scope, id)

        const bucket = new s3.Bucket(this, "EnquiryConsumer")

        const handler = new lambda.Function(this, "EnquiryConsumerHandler", {
            runtime: lambda.Runtime.NODEJS_14_X,
            code: lambda.Code.fromAsset("src"),
            handler: "EnquiryConsumerHandler.main",
            environment: {
                BUCKET: bucket.bucketName,
            }
        })

        bucket.grantReadWrite(handler)

        handler.addEventSourceMapping('EnquiryTableStream', {
                batchSize: 1,
                eventSourceArn: this.enquiryTableStreamArn,
                startingPosition: lambda.StartingPosition.LATEST,
        })

        handler.addToRolePolicy(new iam.PolicyStatement({
            actions: ['dynamodb:DescribeStream', 'dynamodb:GetRecords', 'dynamodb:GetShardIterator', 'dynamodb:ListStreams', 'dynamodb:ListShards'],
            resources: [this.enquiryTableStreamArn]
        }))
        handler.addToRolePolicy(new iam.PolicyStatement({
            actions: ['ses:SendEmail'],
            resources: ['*'],
            effect: iam.Effect.ALLOW,
        }))
    }
}