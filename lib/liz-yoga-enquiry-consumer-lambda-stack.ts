import * as cdk from '@aws-cdk/core';
import {EnquiryConsumerConstruct} from "./enquiry-consumer-construct";

export class LizYogaEnquiryConsumerLambdaStack extends cdk.Stack {
  constructor(scope: cdk.Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);
    new EnquiryConsumerConstruct(this, 'EnquiryConsumer')
  }
}
