### CRUD API


This is a simple crud server for a job from RSschool.
To start the server, you nned to:
- clone this repository;
- switch to 'simple-crud-api' branch (`git checkout simple-crud-api`)
- install dependencies (`npm i`);

Now you can use one of this commands to start server:
- npm run start:dev (developer mode);
- npm run start:prod (production mod - build and start);
- npm run start:multi (cluster mode)

#### The following paths are available for queries:
- GET `/api/users` - get all users
- GET `/api/users/{userId}` get user by id
- POST `/api/users`create user
- PUT `/api/users/{userId}` edit user
- DELETE `/api/users/{userId}` delete user
