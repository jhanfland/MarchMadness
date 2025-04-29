# Name
March Madness Betting Platform

# Description
This project will be able to provide a platform for users to bet money on basketball teams for this year's March Maddness. Specific features are yet to be determined, but it serves the general purpose of provided a sports betting platform. During discussion, it was mentioned that the functionaliy would be similar to how ESPN does betting.

# Instructions
## Docker
How to start containers:

Command for starting containers in a development environment:
```shell
docker-compose -f docker-compose-dev.yml up --build
```

Command for starting contaiers in a production environment:
```shell
docker-compose -f docker-compose-prod.yml up --build
```
## React
How to start React server:
```shell
npm run dev
```

## Visuals
Logo for our project:
![image info](./logo.png)

## Roadmap

# Planning Stage
We are in the progress of deciding what functionality we want out project to have. We have a logo and plan on what tools we want to use to develop the platform.

# Development Stage
We intend developing the backend using python and creating the frontend/UI using react.

## Authors and acknowledgment
Stephen Bail, Norris Chen, Jack Hanfland, Max Hubenko, Krishaan Ghagat, and Lance Munson

# Project status
This project is still in the beginning stages of development. We have yet to come up with any ideas for functionality but we have came up with a logo, a style guide, a SKELETON.md template, a ROLES.md file, and a README.md file.

## Sprint 1, Week 0 (Febuary 12 - 19) - Progress Report
So far, we have completed the Figma design for the UI, and initialized the React application. We have set up the SQL database, and found APIs that could be used for our project. We also researched about the backend to understand the work and code we will need for the future.

Our plan for this week is to set up the backend. And then containerize the frontend, backend, and database, and ensure communication between all three.

## Sprint 1, Week 1 (Febuary 19 - 26) - Progress Report
This week we containerized and dockerized the frontend, backend and database

Our plan for next week is to set up the sign in page, start user authentication for the sign in page

## Sprint 1, Week 2 (Febuary 26 - March 4) - Progress Report
This week we completed the sign in page, and also the user authentication and now all three, frontend, backend, database are functional and talking to each other.

Our plan for next week is to start implimenting the API calls and information into the database and complete the homepage and bar to choose which page you are on for the frontend 

## Sprint 2, Week 1 (March 4 - March 11) - Progress Report
Going into sprint 2, our team was able to clear out a majority of the issues from sprint 1, leaving the "update STYLEmd" as the only remaining issue that is left open from sprint 1. This week we were able to implement the website homepage, which has a user-friendly interface and closely followed our Figma design. 

Our plan for next week is to create a frontend skeleton for our bracket and have it work with the backend API call. Additionally we want to set up our production container and create a CI/CD pipeline, while continuing to update documentation as needed. 

## Sprint 2, Week 2 (March 11 - March 18) - Progress Report
This week we were able to complete the bracket skeleton, and we created our backend bracket functionality with the proper API calls. We also restructued some of the website functionality, and updated our dev container so that it would dynamically update our website when we made changes in frontend. 

Ideally, our plan for next week is to have a functioning bracket that has all the march madness teams and all their respective information (seeding, matchup, region, game start, etc). This will require some additional work in both our frontend, backend, and testing.

## Sprint 2, Week 3 (March 18 - April 2) - Progress Report
Over the past two weeks (including spring break), our group successfully implemented the user team selection functionality and the logic to auto-populate the later rounds with previously selected winners. This basically completed the bulk of our march madness website features. We also added a "live bracket" page, giving users a dynamic view of the ongoing March Madness bracket. With these two major components complete, we’ve successfully met our Sprint 2 objectives and remain well on track to hit our end-of-year goals. 

Our plans for the upcoming weeks are to continue developing some missing features. These include adding respective information to teams (seeding, game start, etc), developing a save bracket option, incorporating a user scoring system, minor UI updates, among others. 
## Sprint 3, Week 1 (April 2 - April 9) - Progress Report
This week our group added a save bracket feature that adds the user bracket to the bracket table in our database. This has put us in a succesful spot as far as finishing our bracket scoring and functionality. Additionally, we added new UI changes to improve the look of our homepage.

Our plan for next week is to finish everything related to the brackets for good. Outside of this we can begin focusing on improving our CI/CD pipeline, deploying our production containers, and finally adding any optional features that our group agrees on.
