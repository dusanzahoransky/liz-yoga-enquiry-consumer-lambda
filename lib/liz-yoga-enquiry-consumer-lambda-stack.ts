import {EnquiryConsumerConstruct} from "./enquiry-consumer-construct";
import {Construct} from "constructs";
import {Stack, StackProps} from "aws-cdk-lib";

export class LizYogaEnquiryConsumerLambdaStack extends Stack {
  constructor(scope: Construct, id: string, props?: StackProps) {
    super(scope, id, props);
    new EnquiryConsumerConstruct(this, 'EnquiryConsumer')
  }
}
