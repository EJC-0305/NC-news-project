const app = require('../db/app');
const request = require('supertest');
const seed = require('../db/seeds/seed.js');
const data = require('../db/data/test-data/index.js');
const connection = require('../db/connection.js');

beforeEach(() => {
    return seed(data);
})

afterAll(() => {
    connection.end();
})

describe('/api', () => {
    test('GET: 200 Responds with an object describing all the available endpoints', () => {
        return request(app)
        .get('/api')
        .expect(200)
        .then(({ body }) => {
            const availableEndpoints = Object.keys(body.endpoints)
            availableEndpoints.forEach((endpoint) => {
                expect(endpoint.startsWith('GET') || endpoint.startsWith('POST') || endpoint.startsWith('DELETE') || endpoint.startsWith('PATCH')).toBe(true);
                expect(body.endpoints[endpoint]).toMatchObject({
                    description: expect.any(String),
                    queries: expect.any(Array),
                    requestFormat: expect.any(Object),
                    exampleResponse: expect.any(Object)
                })
            })
        })
    })
})

describe('/api/topics', () => {
    test('GET: 200 Responds with an array of topic objects', () => {
        return request(app)
        .get('/api/topics')
        .expect(200)
        .then(({ body }) => {
            expect(body.topics.length).toBe(3);
            body.topics.forEach((topic) => {
                expect(topic).toMatchObject({
                    description: expect.any(String),
                    slug: expect.any(String)
                });
            });
        })
    })
})