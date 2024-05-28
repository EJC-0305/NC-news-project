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