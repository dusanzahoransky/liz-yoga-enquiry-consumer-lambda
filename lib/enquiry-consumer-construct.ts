import {Construct} from "constructs";
import {aws_iam, aws_lambda, aws_s3} from "aws-cdk-lib";

export class EnquiryConsumerConstruct extends Construct {

    private enquiryTableStreamArn = 'arn:aws:dynamodb:ap-southeast-2:473300111098:table/Enquiry/stream/2022-09-06T14:49:04.895'

    constructor(scope: Construct, id: string) {
        super(scope, id)

        const bucket = new aws_s3.Bucket(this, "EnquiryConsumer")

        const handler = new aws_lambda.Function(this, "EnquiryConsumerHandler", {
            runtime: aws_lambda.Runtime.NODEJS_14_X,
            code: aws_lambda.Code.fromAsset("src"),
            handler: "EnquiryConsumerHandler.main",
            environment: {
                BUCKET: bucket.bucketName,
            }
        })

        bucket.grantReadWrite(handler)

        handler.addEventSourceMapping('EnquiryTableStream', {
                batchSize: 1,
                eventSourceArn: this.enquiryTableStreamArn,
                startingPosition: aws_lambda.StartingPosition.LATEST,
        })

        handler.addToRolePolicy(new aws_iam.PolicyStatement({
            actions: ['dynamodb:DescribeStream', 'dynamodb:GetRecords', 'dynamodb:GetShardIterator', 'dynamodb:ListStreams', 'dynamodb:ListShards'],
            resources: [this.enquiryTableStreamArn]
        }))
        handler.addToRolePolicy(new aws_iam.PolicyStatement({
            actions: ['ses:SendEmail'],
            resources: ['*'],
            effect: aws_iam.Effect.ALLOW,
        }))
    }
}