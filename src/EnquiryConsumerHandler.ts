import {DynamoDBRecord, DynamoDBStreamEvent} from "aws-lambda"
import {EnquiryConsumer} from "./EnquiryConsumer";

exports.main = async (event: DynamoDBStreamEvent): Promise<any> => {
    await Promise.all( event.Records.map( record => handleRecord(record) ))
}

async function handleRecord(record: DynamoDBRecord) {
    try{
        await new EnquiryConsumer().processRecord(record)
    } catch (e) {
        if(record.dynamodb){
            console.log(`Fail to process ${record.eventID}: ${JSON.stringify(record.dynamodb.NewImage)}`, e, e.stack)
        }
        console.log(`Fail to process ${record.eventID}`, e, e.stack)
    }
}