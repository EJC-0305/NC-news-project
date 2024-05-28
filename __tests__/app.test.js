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

describe('all endpoints', () => {
    test('404: Responds with error message when passed an invalid endpoint', () => {
        return request(app)
        .get('/api/invalid-endpoint')
        .expect(404)
        .then(({ body }) => {
            expect(body.msg).toBe('Not found')
        })
    })
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

describe('/api/article/:articles_id', () => {
    test('GET: 200 Responds with an array of topic objects', () => {
        return request(app)
        .get('/api/articles/1')
        .expect(200)
        .then(({ body }) => {
            expect(body.article).toMatchObject({
                article_id: 1,
                title: "Living in the shadow of a great man",
                topic: "mitch",
                author: "butter_bridge",
                body: "I find this existence challenging",
                created_at: expect.any(String),
                votes: 100,
                article_img_url:
                  "https://images.pexels.com/photos/158651/news-newsletter-newspaper-information-158651.jpeg?w=700&h=700",
              })
        })
    })
    test('GET: 404 Responds with error message when passed a valid but non-existing article id', () => {
        return request(app)
        .get('/api/articles/9999')
        .expect(404)
        .then(({ body }) => {
            expect(body.msg).toBe('Article does not exist')
        })
    })
    test('GET: 400 Responds with error message when passed an invalid article id', () => {
        return request(app)
        .get('/api/articles/not_an_id')
        .expect(400)
        .then(({ body }) => {
            expect(body.msg).toBe('Bad request')
        })
    })
})