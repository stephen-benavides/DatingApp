import { User } from "./User";

export class UserParams{
    gender: string;
    minAge:number = 18;
    maxAge:number = 99;
    pageNumber:number = 1;
    pageSize: number = 3;
    orderBy: string = "lastActive"; //same default behavior as the API, setting lastActive as default

    constructor(user: User) {
        //if the gender is female, display male, and viceversa 
        this.gender = (user.gender === 'female') ? 'male' : 'female';
    }
}

/*
Purpose of this class is to make it easier to pass the objects to the backend
    1. Replaces _services > members.services.ts > getMembers(pageNumber?: number, pageSize?: number) {
    2. Sends the data to:
        Account Controller > Login() && Register()

STUDY NOTES - Angular Classes VS Interfaces 
    Classes:
        1. Can have constructor to initialize the properties
        2. Must be initialized
    Interfaces:
        1. Do not have constructor, only properties. 
        2. May only be defined and not initialized 
*/