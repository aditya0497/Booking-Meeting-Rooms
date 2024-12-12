# BookMeetingRoom

This project was generated with [Angular CLI](https://github.com/angular/angular-cli) version 15.2.11.

## Development server

Run `ng serve` for a dev server. Navigate to `http://localhost:4200/`. The application will automatically reload if you change any of the source files.

## Build

Run `ng build` to build the project. The build artifacts will be stored in the `dist/` directory.

## Running unit tests

Run `ng test` to execute the unit tests via [Karma](https://karma-runner.github.io).

Backend is up and used in the following commands: json-server --watch db.json --port 3000

## About the application
The dashboard consists of two tables:
    1. The user can view the meetings that are upcoming and also a filter is available to filter based on rooms.
    2. The user can also view the slots that are booked by all the available users in the system through the filter options available on the basis of room chosen from dropdown.

Two API endpoints are used in the application to mimic real time application feeling:
  http://localhost:3000/meetings
  http://localhost:3000/rooms

By Default, the user will be routed to the login page. Even if user tries to by-pass the login by changing the route in the URL, it will be checked if user has logged in or not and only if the user has logged in it will allow access.

For real-time, deployments is done on vercel and connected to a database using supabase.
