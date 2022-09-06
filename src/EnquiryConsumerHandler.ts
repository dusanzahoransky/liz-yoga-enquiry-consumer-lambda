import {DynamoDBRecord, DynamoDBStreamEvent} from "aws-lambda"
import {EnquiryConsumer} from "./EnquiryConsumer";

exports.main = async (event: DynamoDBStreamEvent): Promise<any> => {
    await Promise.all( event.Records.map( record => handleRecord(record) ))
}

async function handleRecord(record: DynamoDBRecord) {
    try{
        await new EnquiryConsumer().processRecord(record)
    } catch (e) {
        const error = e as Error
        if(record.dynamodb){
            console.log(`Fail to process ${record.eventID}: ${JSON.stringify(record.dynamodb.NewImage)}`, error, error.stack)
        }
        console.log(`Fail to process ${record.eventID}`, error, error.stack)
    }
}