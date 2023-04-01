
Query Builder Instructions:

# Dependencies:

You will need to have Postgres installed on you local machine.


## Install the dependencies:

1) go to the client folder and run:
```bash
npm install
```
2) go to the server folder and run:
```bash
npm install
```

## Update Postgres config

Under the sever folder, under the config folder, is a configuration file (database.js) that holds the config
to connect to your local PG database.

currently the configuration are:

database: "postgres",
username: "postgres",
password: "admin",
port: 5432,

Please update them according to your own PG database configuration.

### Start the the client and server:

1) go to the client folder and run:
```bash
quasar dev
```

2) go to the server folder and run:
```bash
node index.js
```

Note:
I used the "faker" library in order to populate an Employee table with dummy data (1000 records).
Sometime the faker library creates the same names which causes the server to crush while going up.
Please just raise it again until it succeeds (shouldn't take more the 1 -3 tries).


### Run server unit tests:

1) go to the server folder and run:
```bash
npm test
```

# Explanation on architectural and components design:

- A query builder is usually used on structured data.
For this reason, I decided to choose a Rational database, and not a non Rational database (like Mongo).
Since I wanted to save the queries made by the user as a JSON, the PG database was a natural choice since
it supports a JSON type columns.

- I decided to to use the "sequlize" ORM in the server side since I found it very "user friendly" and easy to
write and configure.

- I added a Login/Register page so that we could create users and each user will be able to create his own queries, save them, delete them, or load them.

- For the authentication, I decided to use the JWT paradigm.
    When a user successfully login to the system, a JWT is created on the server side and send to the client side.
    On the client side, the JWT and the user ID, which is embedded in the JWT, are both saved in the browser local storage, and are automatically sent with each API call (except for the Register and Login APIs) inside the Authorization header.
    On the server side, I configured all the routs, using an authentication middleware, to only accept requests that have a valid JWT.
    Also, I have "salted" and encrypted all the password when a users are created.

- I added a sanitation middleware for some of the server API endpoints.

- I added some unittest on the server side to check that the query parsing methods are working as expected.


## Things that could be improved in the application:

1) Currently, on the client, all the Group and Rule components are passing their state with events to their parent component, until it reaches the main Query Builder component that hold the all query structure.
A better way might be to use a store (like Pnina or Vuex) that can save the current query state and update it whenever a Group or a Rule component changes.

2) In a real production application, there should be no "console.log" calls in the code and all the logs should be sent to one main Log Service that will be responsible for sending all the logs to one place - For example to an S3 bucket, so that we could use the AWS CloudWatch service or something like "New Relic" to query the log files).

3) Currently, the application UI is not entirely responsive, since I used in some css classes the "px" value.
This could be improved in the future.

4) We can add more unit tests on the server side for all the routes, to check that they are throwing the expected exceptions, and returning the expected status code for each scenario.
We can also add unit tets on the client side to set some of the components functionality.