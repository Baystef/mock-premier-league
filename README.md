# Mock Premier League
 API that serves the latest scores of fixtures of matches in a “Mock Premier League”


## Technologies

- Node JS
- Express
- ESLint
- Babel
- MongoDB
- Redis
- POSTMAN
- Jest


## Prerequisites

To work with this project, you need to have the following setup on your local machine

1. [NodeJS](https://nodejs.org)
2. [Git](https://git-scm.com/downloads)
3. [Postman](https://www.getpostman.com/downloads)
4. [Redis](https://www.redislabs.com)

## Install and run locally

```bash
$ git clone https://github.com/Baystef/mock-premier-league.git
$ cd Mock-PL

$ npm i
$ npm run seed 
$ npm run start:dev
```
```bash
If redis has been successfully installed and configured (For windows users)

$ start redis-server.exe redis.windows.conf
$ start redis-cli.exe 

On the redis-cli, send a 
$ ping
you should get a 
$ pong 
response this means redis port is live and ready.

To see changes in real time, send
$ monitor
```
## Testing
```
$ npm test
```

# API Usage


```js
// login as admin
{
  email: "admin@mockpl.com",
  password: "password"
}

// login as user
{
  email: "mason@manutd.com",
  password: "password"
}
```

API BASE URL https://mock-pl.herokuapp.com/.

## Authentication endpoints `/api/v1/users`

| method | route        | description               | data                                          |
| ------ | ------------ | ------------------------- | ----------------------------------------------|
| POST   | /users/signup| Sign Up                   | `{first_name, last_name, email, password}`    |
| POST   | /users/signin| Sign In                   | `{email, password}`                           |
| POST   | /users/logout| Logout                    |                                               |



## User endpoints `/api/v1/users`

| method | route               | description             | data                                 |
| ------ | ------------------- | ----------------------- | ------------------------------------ |
| GET    | /users              | Get all users           |                                      |
| PATCH  | /users/admin/:email | Create Admin            |                                      |



## Team endpoints `api/v1/teams`

| method | route            | description          | data                            |
| ------ | ---------------- | -------------------- | ------------------------------- |
| POST   | /teams           | Add a team           | `{teamName, noOfPlayers, coach}`|
| GET    | /teams           | Get all teams        |                                 |
| GET    | /teams?_teamName_| Get team by name     |                                 |
| GET    | /teams?_coach_   | Get team by coach    |                                 |
| PUT    | /teams/:teamName | Update a team        | `{teamName, noOfPlayers, coach}`|
| DELETE | /teams/:teamName | Delete a team        |                                 |
           

## Fixture endpoints `api/v1/fixtures`

| method | route          | description             | data                                 |
| ------ | -------------- | ----------------------- | ------------------------------------ |
| POST   | /fixtures      | Create a fixture        | `{ homeTeam, awayTeam, fixtureDate }`|
| GET    | /fixtures      | Get all fixtures        |                                      |
| GET    | /fixtures?_status_| Get pending or completed fixtures|                          |
| GET    | /fixtures?_fixtureLink_| Get a fixture   |                                      |
| PUT    | /fixtures/:fixtureLink | Update a fixture| `{ homeTeam, awayTeam, fixtureDate }`|
| DELETE | /fixtures?_fixtureLink_| Delete a fixture|                                      |
| PATCH  | /fixtures/play/:fixtureLink| Complete a fixture|                                |


## Search endpoint `api/v1/search`

| method | route          | description             | data                                 |
| ------ | -------------- | ----------------------- | ------------------------------------ |
| POST   | /search?_term_ | Robust search with home or away team as _term_ query |         |


## Admin only endpoints 

| method | route                      | description               | 
| ------ | -------------------------- | ------------------------- |
| GET    | /users                     | Get all users             |
| PATCH  | /users/admin/:email        | Create Admin              |
| POST   | /teams                     | Add a team                |
| PUT    | /teams/:teamName           | Update a team             |
| DELETE | /teams/:teamName           | Delete a team             |
| POST   | /fixtures                  | Create a fixture          |
| PUT    | /fixtures/:fixtureLink     | Update a fixture          |
| PATCH  | /fixtures/play/:fixtureLink| Complete a fixture        |
| DELETE | /fixtures?_fixtureLink_    | Delete a fixture          |


# API Docs
https://documenter.getpostman.com/view/7629676/SVn2Pvxo
# App URL
https://mock-pl.herokuapp.com/
# Author
Daramola Adebayo
# LICENSE
The code in this project is licensed under MIT license.