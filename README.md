
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
