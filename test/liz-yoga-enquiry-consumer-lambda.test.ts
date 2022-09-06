import * as LizYogaEnquiryConsumerLambda from '../lib/liz-yoga-enquiry-consumer-lambda-stack';
import {App} from "aws-cdk-lib";
import {Template} from "aws-cdk-lib/assertions";

test('Stack with Lambda', () => {
    const app = new App();
    // WHEN
    const stack = new LizYogaEnquiryConsumerLambda.LizYogaEnquiryConsumerLambdaStack(app, 'MyTestStack');
    // THEN
    const template = Template.fromStack(stack);
    template.resourceCountIs('AWS::Lambda::Function', 1)
});
