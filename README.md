# DatingApp

## Overview
This project is built using ASP.NET Core and Angular 16, designed for high performance and scalability in production environments. It's configured to show minimal debugging details in production, while in development mode, it provides extensive debug information to aid the development process.

## Technologies
This application is developed with a range of technologies making it robust and flexible:

- **C#**
- **ASP.NET CORE**
- **Angular v16+**
- **SQL**
- **LINQ**
- **Entity Framework**
- **HTML**
- **CSS**
- **JavaScript**
- **TypeScript**
- **SQLite DB**
- **Jason Web Tokens (JWT)**
- **Dependency Injection**
- **Cross-Origin Resource Sharing (CORS)**
- **RxJS**
- **Bootstrap**
- **ngx-bootstrap**
- **Bootswatch** access to more themes to supplement bootstrap
- **Middleware** to catch and handle all exceptions in server and client side
- **Toastr** for non-blocking notifications
- **Interceptors** using RxJS - to handle responses/requests to the server. Including handling of the JSON Web Tokens (JWT) to validate each request with the server, removing the need of manually adding additional headers in the request for the Bearer token validation. 
- **AutoMapper**
- **Animations** to provide better user experience when navigating the UI
- **FontAwesome** 
- **Angular Component Dev Kit (CDK)** 
- **ngx-gallery** 3rd party photo gallery tool, to display gallery images to the client, uses StandAlone Components for its functioning
- **ActivatedRoute** to get values from the query string / route parameters 

### Development Tools
- **Environment:** Linux Ubuntu
- **IDE:** VSCode
- **CLI Tools:** dotnet, ng, npm, Oh My Zsh!

## Configuration
The application is ready for the PROD environment. Switching the server to DEV mode will enable detailed debug information, facilitating development and testing.
