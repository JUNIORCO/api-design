# API Design
Simple backend JSON api.

## Running The Server
Clone the repo

```git
git clone https://github.com/JUNIORCO/api-design.git
```

Install the dependencies

```npm
npm install
```

Start the project (port 3000)

```npm
npm start
```

Run the tests

```npm
npm test
```

Use a service like Postman to hit the endpoints defined below

## API Requirements
### Route 1

Request: `GET /api/ping`

Response:

```JSON
{
  "success": true
}
Status code 200
```

### Route 2

Request: `GET /api/posts`

Query Params:

| Field     | Type              | Description                                                                          | Default | Example      |
|-----------|-------------------|--------------------------------------------------------------------------------------|---------|--------------|
| tags      | string (required) | A comma separated list of tags                                                       | N/A     | science,tech |
| sortBy    | string (optional) | The field to sort the posts by.  Acceptable fields are: id, reads, likes, popularity | id      | popularity   |
| direction | string (optional) | The direction of the sorting. Acceptable fields are: asc, desc                       | asc     | asc          |

Response:

```json
{
  "posts": [
    {
      "id": 1,
      "author": "Rylee Paul",
      "authorId": 9,
      "likes": 960,
      "popularity": 0.13,
      "reads": 50361,
      "tags": [ "tech", "health" ]
    },
    ...
  ]
}
Status code 200
```

### Error Responses
If `tags` parameter is not present:
```json
{
  "error": "Tags parameter is required"
}
Status code 400
```

If `sortBy` or `direction` parameter is not present:
```json
{
  "error": "sortBy parameter is invalid"
}
Status code 400
```

## API Design
`Express.js` and `express-validator` to build the server and validate the incoming requests.

`axios` for API call

`jest`, `sinon`, `supertest` for unit and integration testing

`memory-cache` for caching the responses (if not cached, API call takes ~200ms. If cached, API call takes ~5ms)

Written in `Typescript`, making use of interfaces, enums, and generics for clean, extensible, and maintainable code

