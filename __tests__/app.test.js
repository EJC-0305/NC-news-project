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

describe('/api/articles', () => {
    test('GET: 200 Responds with an array of all article objects with comment count added and body removed - in descending order of creation date', () => {
        return request(app)
        .get('/api/articles')
        .expect(200)
        .then(({ body }) => {
            expect(body.articles.length).toBe(13);
            expect(body.articles[0]).toMatchObject({
                article_id: 3,
                title: expect.any(String),
                topic: expect.any(String),
                author: expect.any(String),
                created_at: expect.any(String),
                votes: expect.any(Number),
                article_img_url: expect.any(String),
                comment_count: "2",
            });
            expect(body.articles[0]).not.toHaveProperty('body');
            expect(body.articles).toBeSortedBy("created_at", {
                descending: true
            })
        })
    })
})

describe('/api/articles/:articles_id', () => {
    test('GET: 200 Responds with article object of specified id', () => {
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

    test('PATCH: 200 Responds with updated article', () => {
        return request(app)
        .patch('/api/articles/1')
        .send({
            inc_votes : 1
        })
        .expect(200)
        .then(({ body }) => {
            expect(body.article).toMatchObject({
                article_id: 1,
                title: "Living in the shadow of a great man",
                topic: "mitch",
                author: "butter_bridge",
                body: "I find this existence challenging",
                created_at: expect.any(String),
                votes: 101,
                article_img_url:
                  "https://images.pexels.com/photos/158651/news-newsletter-newspaper-information-158651.jpeg?w=700&h=700",
            })
        })
    })

    test('PATCH: 404 Responds with error message when passed a valid but non-existing article id', () => {
        return request(app)
        .patch('/api/articles/9999')
        .send({
            inc_votes : 1
        })
        .expect(404)
        .then(({ body }) => {
            expect(body.msg).toBe('Article does not exist')
        })
    })

    test('PATCH: 400 Responds with error message when passed an invalid article id', () => {
        return request(app)
        .patch('/api/articles/not_an_id')
        .send({
            inc_votes : 1
        })
        .expect(400)
        .then(({ body }) => {
            expect(body.msg).toBe('Bad request')
        })
    })

    test('PATCH: 400 Responds with error message when passed an invalid inc_votes value', () => {
        return request(app)
        .patch('/api/articles/not_an_id')
        .send({
            inc_votes : 'cat'
        })
        .expect(400)
        .then(({ body }) => {
            expect(body.msg).toBe('Bad request')
        })
    })
})

describe('/api/articles/:articles_id/comments', () => {
    test('GET: 200 Responds with array of comments for article with specified id sorted in descending date order', () => {
        return request(app)
        .get('/api/articles/1/comments')
        .expect(200)
        .then(({ body }) => {
            expect(body.comments.length).toBe(11);
            body.comments.forEach((comment) => {
                expect(comment).toMatchObject({
                    comment_id: expect.any(Number),
                    body: expect.any(String),
                    votes: expect.any(Number),
                    author: expect.any(String),
                    article_id: 1,
                    created_at: expect.any(String)
                })
            })
            expect(body.comments).toBeSortedBy("created_at", {
                descending: true
            })
        })
    })

    test('GET: 404 Responds with error message when passed a valid but non-existing article id', () => {
        return request(app)
        .get('/api/articles/9999/comments')
        .expect(404)
        .then(({ body }) => {
            expect(body.msg).toBe('Article does not exist')
        })
    })

    test('GET: 400 Responds with error message when passed an invalid article id', () => {
        return request(app)
        .get('/api/articles/not_an_id/comments')
        .expect(400)
        .then(({ body }) => {
            expect(body.msg).toBe('Bad request')
        })
    })

    test('GET: 200 Responds with empty array when passed a valid article_id but which has no comments', () => {
        return request(app)
        .get('/api/articles/2/comments')
        .expect(200)
        .then(({ body }) => {
            expect(body.comments).toEqual([])
        })
    })

    test('POST: 201 Responds added comment object', () => {
        return request(app)
        .post('/api/articles/5/comments')
        .send({
            username: 'butter_bridge',
            body: "Meow"
        })
        .expect(201)
        .then(({ body }) => {
            expect(body.new_comment).toMatchObject({
                    comment_id: 19,
                    body: "Meow",
                    votes: 0,
                    author: 'butter_bridge',
                    article_id: 5,
                    created_at: expect.any(String)
            })
        })
    })

    test('POST: 404 Responds with error message when passed a valid but non-existing article id', () => {
        return request(app)
        .post('/api/articles/9999/comments')
        .send({
            username: 'butter_bridge',
            body: "Meow"
        })
        .expect(404)
        .then(({ body }) => {
            expect(body.msg).toBe('Article does not exist')
        })
    })

    test('POST: 400 Responds with error message when not passed necessary properties in body', () => {
        return request(app)
        .post('/api/articles/5/comments')
        .send({
            body: "Meow"
        })
        .expect(400)
        .then(({ body }) => {
            expect(body.msg).toBe('Bad request')
        })
    })
})

