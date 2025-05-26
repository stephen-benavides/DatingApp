export interface Pagination{
    currentPage : number,
    itemsPerPage: number, 
    totalItems : number,
    totalPages : number
}


export class PaginatedResult<T>{
    //Stores the list of members 
    result?: T;
    //Store the pagination data from the server 
    pagination?: Pagination;
}

/*
    STUDY NOTES - PAGINATION (6) - Client Side 
    1. With the pagination retrieved in the header i.e.: {{url}}/api/users?pageNumber=2&pageSize=3
    This class will be used to map the objects from the server to the client 
    2. Interfaces are used to set a contract, in this case the contract means the properties of a given objects, whereas a class
    hold both the properties and methods (behavior) of the object 
    3. PaginatedResult<T> is generic because this class will have information of elements other than Members 
*/