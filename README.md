# Winter 2022 Interview Challenge for AES Outreach

This assignment is an AdonisJS with TypeScript app that has 2 endpoints. It uses a SqlLite database to store data.

[![test](https://github.com/art29/aes-outreach-backend-challenge/actions/workflows/test.yml/badge.svg)](https://github.com/art29/aes-outreach-backend-challenge/actions/workflows/test.yml)

## Endpoints

- POST /create
  - (Takes an array of doorIds), ex: data={doorIds: {1, 2, 3}
  - Returns HTTP422 if missing params, and HTTP201 with an accessToken if it works
- POST /validate
  - (Takes a doorId and accessToken), ex: data={doorId: 1, accessToken: '5cc6d1f0-bd6f-47ec-a2d9-c82466cfffb5'}
  - Returns : HTTP422 if missing params, and HTTP200 "access": "granted" if valid or "access": "failed" if not

## Run app

Install dependencies

```bash
  npm install
```

Create the db file

```bash
  mkdir -p tmp && touch tmp/db.sqlite3
```

Run DB migrations

```bash
  node ace migration:run
```

Run app

```bash
  npm run dev
```

Run tests (You can also see them run in the GitHub Actions tab)

```bash
  npm test
```
