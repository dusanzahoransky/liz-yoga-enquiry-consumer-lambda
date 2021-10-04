import AWS from 'aws-sdk'
import {Enquiry, YogaClass} from './Enquiry';
import {SendEmailRequest} from 'aws-sdk/clients/ses';
import {DynamoDBRecord} from "aws-lambda";

export class EnquiryConsumer {

    async processRecord(enquiryRecord: DynamoDBRecord) {

        const newImage = enquiryRecord.dynamodb?.NewImage;
        if(!enquiryRecord.dynamodb || !newImage){
            console.log(`Empty record or new image, skipping processing`)
            return
        }

        const enquiry: Enquiry = {
            sortKey: newImage.sortKey.S!!,
            partitionKey: newImage.partitionKey.S!!,
            preferredTime: newImage.preferredTime.S!!,
            mobile: newImage.mobile.S!!,
            name: newImage.name.S!!,
            enquiry: newImage.enquiry.S!!,
            yogaClass: newImage.yogaClass.S!! as YogaClass,
            email: newImage.email.S!!,
        }

        const fromTo = 'elizabethneirar@gmail.com';
        const subject = EnquiryConsumer.toSubject(enquiry);
        const data = EnquiryConsumer.toData(enquiry);

        const emailReq: SendEmailRequest = {
            Destination: {
                ToAddresses: [
                    fromTo,
                ]
            },
            Message: {
                Body: {
                    Html: {
                        Charset: 'UTF-8',
                        Data: data
                    }
                },
                Subject: {
                    Charset: 'UTF-8',
                    Data: subject
                }
            },
            Source: fromTo
        };

        AWS.config.update({region: 'ap-southeast-2'})
        const emailResp = await new AWS.SES().sendEmail(emailReq).promise();

        console.log(`Email ${emailResp.MessageId} sent`)
    }

    private static toSubject(enquiry: Enquiry): string {
        return `[YOGA ENQUIRY] ${enquiry.yogaClass} for ${enquiry.mobile} ${(enquiry.name ? enquiry.name : '')}`;
    }

    private static toData(enquiry: Enquiry): string {
        return `<html lang="en">
            <body>
                <p>yogaClass: ${enquiry.yogaClass}</p>
                <p>name: ${enquiry.name}</p>
                <p>mobile: ${enquiry.mobile}</p>
                <p>email: ${enquiry.email}</p>
                <p>preferredTime: ${enquiry.preferredTime}</p>
                <p>enquiry: ${enquiry.enquiry}</p>
                
                <div style="display:none;">
                    <p>partitionKey: ${enquiry.partitionKey}</p>
                    <p>sortKey: ${enquiry.sortKey}</p>
                </div>
            </body>
        </html>`;
    }
}