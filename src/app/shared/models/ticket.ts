import { Timestamp } from 'firebase/firestore';

export interface ITicket {
    id: string;
    name: string;
    addressId: string;
    birthDate: Timestamp;
    gender: Gender;
    socialStatus: SocialStatus;
    mobile: string;
    transportationId: string;
    userNotes: string;
    bookingDate: Timestamp;
    adminNotes: string;
    total: number;
    paid: number;
    remaining: number;
    ticketStatus: TicketStatus;
    ticketType: TicketType;
    roomId: string;
    adultsCount: number;
    childrenCount: number;
    needsSeparateBed: boolean;
    isChild: boolean;
    isMain: boolean;
    primaryId: string;
    age?: number;
}

export interface IUserInfo {
    name: string;
    addressId: string;
    birthDate: Timestamp;
    gender: Gender;
    socialStatus: SocialStatus;
    mobile: string;
    transportationId: string;
    userNotes: string;
}

export interface IPrimary extends IUserInfo {
    id: string;
    bookingDate: Timestamp;
    adminNotes: string;
    total: number;
    paid: number;
    remaining: number;
    ticketStatus: TicketStatus;
    ticketType: TicketType;
    roomId: string;
}

export interface IParticipant extends IUserInfo {
    id: string;
    needsSeparateBed: boolean;
    isChild: boolean;
}

export interface ITicketForm extends IPrimary {
    participants: Array<IParticipant>;
}

export enum TicketStatus {
    new = 1,
    confirmed = 2,
    duplicated = 3,
    canceled = 4
}

export enum SocialStatus {
    single = 1,
    married = 2,
    widower = 3
}

export enum TicketType {
    individual = 1,
    group = 2
}

export enum Gender {
    male = 1,
    female = 2
}

