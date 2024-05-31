# Northcoders News API

## What is the purpose of this project?

This is my back-end project completed during the [Northcoders](https://northcoders.com/) Software Engineering bootcamp.

The aim of this project is to build an API for the purpose of accessing application data programmatically and mimic the building of a real world backend service - in this case for a news website.

During the project I have written code and error handling for a multitude of endpoints - all with TDD - making use of several dependancies (listed below).

Moving forward I aim to add more functionality more queries in order to increase the utility of this application.

---

## How to install and run the project:

You can clone this project from GitHub via [my repo](https://github.com/EJC-0305/NC-news-project).

#### Node and Postgres

Minimum versions required:
- Node: 6.0.0
- Postgres: 8.0.0

#### Dependancies

This project makes use of the following dependancies:
- dotenv: [Installation instructions](https://www.npmjs.com/package/dotenv)
- express: [Installation instructions](https://expressjs.com/en/starter/installing.html)
- pg: [Installation instructions](https://www.npmjs.com/package/pg)

#### Developer Dependancies

This project makes use of the following dev-dependancies:
- jest: [Installation instructions](https://jestjs.io/docs/getting-started)
- jest-extended: [Installation instructions](https://jest-extended.jestcommunity.dev/docs/getting-started/install)
- jest-sorted: [Installation instructions](https://www.npmjs.com/package/jest-sorted)
- pg-format: [Installation instructions](https://www.npmjs.com/package/pg-format)
- supertest: [Installation instructions](https://www.npmjs.com/package/supertest)

To connect to the two databases locally after cloning, env.test and env.development files must be added to this repo which connect to their relevant databases respectively. After this you will need to run **npm run setup-dbs** to establish the databases.

The test database will be seeded automatically when running the test suites using **npm test**. The developer database will need to be seeded manually using the provided script **npm run seed**.

--- 

## How to use this project:

Once set-up is complete, you can run this project in multiple ways, for example:
- Through supertest via the test suites provided
- Through [Insomnia](https://insomnia.rest/)
- Through the API hosting found [here](https://nc-news-back-end-project-oqj5.onrender.com)

For information on available endpoints please see the documentation via endpoint [/api](https://nc-news-back-end-project-oqj5.onrender.com/api).
