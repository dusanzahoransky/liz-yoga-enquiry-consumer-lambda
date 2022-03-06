export enum YogaClass {
    'groups-in-person',
    'groups-online',
    'private-in-person',
    'private-online',
    'workshop-in-person',
    'workshop-online',
}

export interface EnquiryDto {
    yogaClass: YogaClass,
    name?: string,
    email?: string,
    mobile: string,
    preferredTime?: string,
    enquiry: string,
}