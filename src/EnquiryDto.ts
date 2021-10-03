export enum YogaClass {
    'groups-in-person',
    'groups-online',
    'poses-online',
    'private-in-person',
    'private-online'
}

export interface EnquiryDto {
    yogaClass: YogaClass,
    name?: string,
    email?: string,
    mobile: string,
    preferredTime?: string,
    enquiry: string,
}