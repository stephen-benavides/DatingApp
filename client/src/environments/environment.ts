export const environment = {
    production: true,
    apiUrl: 'api/' //based on the prod environemnt 
};




/*STUDY NOTES: NG Environment.ts and Environment.development.ts (Development/Production release)

    - The environments are used as the config file from asp.net 
    - It allows the user to swap environments based on which environment you want to run i.e. Development or Production 
    - The files are usually empty with NO information whatsoever except for the first line (export const environment = {};)
    - Inside the function you must initialized the objects related to the environment 
    - NOTE:
        1. The service where the environments are hosted MUST always import this (environment.ts)
        2. As this is used for all the environments, and the distinction is made by the initialization of the property "production"
            1. Production is set to false in environment.development.ts, 
            2. so the application will change and select the right apiUrl based on the environment. 

    - Environment.ts 
        1. It handles all environments 
        2. Set the endpoint for the project's production environement 
        3. The endpoint is usually the controller URI 
            1. /api/"endpoint"
        4. Set the environments related to production 
            1. production: true, 
                1. As its production environemnt, initializing as true 
            2. apiUrl: 'api/' 
                1. The API server URL
                2. It depends entirely on the service that is going to be hosting the application 
                3. In this case the URL is based directly on the URI of the app 
                4. In any other hosting services, you might requiere the entire URL of the application 
        5. There is to be a distinction in previous version of angular such as: 
            1. environment.production.ts 
            2. environment.development.ts (this one is still active)
            3. We still use it entirely in the same way, it does not matter the change, as the usage is the same


    - Environment.development.ts 
        1. For development environment only 
        2. Set the route for the local project as the endpoint 
        3. The entire thing - https://localhostxxx:4044/api/"endpoint" 
        4. Set the environments related to development 
            1. production: false, 
                1. As its dev environment, initializing as false 
            2. apiUrl: 'https://localhost:5001/api/' 
                2. The API server URL

    - CREATION: 
        1. terminal (client)
        2. ng g environment 
            - no name involved, it is standard 
    
*/