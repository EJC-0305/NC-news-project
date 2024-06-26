const app = require('../db/app');
const request = require('supertest');
const seed = require('../db/seeds/seed.js');
const data = require('../db/data/test-data/index.js');
const connection = require('../db/connection.js');
const endpoints = require('../endpoints.json');

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
            expect(body.endpoints).toEqual(endpoints)
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

    test('GET: 200 Responds with an array of article objects with specified topic when passed a topic query', () => {
        return request(app)
        .get('/api/articles?topic=mitch')
        .expect(200)
        .then(({ body }) => {
            expect(body.articles.length).toBe(12);
            body.articles.forEach((article) => {
                expect(article).toMatchObject({
                    article_id: expect.any(Number),
                    title: expect.any(String),
                    topic: "mitch",
                    author: expect.any(String),
                    created_at: expect.any(String),
                    votes: expect.any(Number),
                    article_img_url: expect.any(String),
                    comment_count: expect.any(String)
                })
                expect(article).not.toHaveProperty('body');
            })
            expect(body.articles).toBeSortedBy("created_at", {
                descending: true
            })
        })
    })

    test('GET: 200 Responds with an empty array when passed an existing topic but which appears in no articles', () => {
        return request(app)
        .get('/api/articles?topic=paper')
        .expect(200)
        .then(({ body }) => {
            expect(body.articles).toEqual([])
        })
    })

    test('GET: 404 Responds with an error message when passed a topic that does not exist', () => {
        return request(app)
        .get('/api/articles?topic=dogs')
        .expect(404)
        .then(({ body }) => {
            expect(body.msg).toBe("Topic does not exist")   
        })
    })

    test('GET: 200 Responds with an array of article objects sorted by column when passed a sort_by query', () => {
        return request(app)
        .get('/api/articles?sort_by=title')
        .expect(200)
        .then(({ body }) => {
            expect(body.articles).toBeSortedBy("title", {
                descending: true
            })
        })
    })

    test('GET: 404 Responds with an error message when passed a column that does not exist in sort_by query', () => {
        return request(app)
        .get('/api/articles?sort_by=not_a_column')
        .expect(404)
        .then(({ body }) => {
            expect(body.msg).toBe("Column does not exist")   
        })
    })

    test('GET: 200 Responds with an array of article objects in ascending order when passed asc in an order_by query', () => {
        return request(app)
        .get('/api/articles?order_by=asc')
        .expect(200)
        .then(({ body }) => {
            expect(body.articles).toBeSortedBy("created_at")
        })
    })

    test('GET: 404 Responds with an error message when passed a non-valid order_by', () => {
        return request(app)
        .get('/api/articles?order_by=not_valid_order_by')
        .expect(404)
        .then(({ body }) => {
            expect(body.msg).toBe("Invalid order_by")   
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

    test('GET: 200 Responds with article object of specified id which has a comment_count property', () => {
        return request(app)
        .get('/api/articles/1')
        .expect(200)
        .then(({ body }) => {
            expect(body.article.comment_count).toBe('11')
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

    test('PATCH: 200 Responds with updated article when passed a valid inc_votes', () => {
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

    test('PATCH: 200 Responds with unchanged article when passed no inc_votes', () => {
        return request(app)
        .patch('/api/articles/1')
        .send({})
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
        .patch('/api/articles/1')
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

    test('POST: 404 Responds with error message when passed a username that does not exist on the database', () => {
        return request(app)
        .post('/api/articles/5/comments')
        .send({
            username: 'Queen Barbara',
            body: "Meow"
        })
        .expect(404)
        .then(({ body }) => {
            expect(body.msg).toBe('User does not exist')
        })
    })

    test('POST: 400 Responds with error message when passed an invalid article id', () => {
        return request(app)
        .post('/api/articles/not_an_id/comments')
        .send({
            username: 'butter_bridge',
            body: "Meow"
        })
        .expect(400)
        .then(({ body }) => {
            expect(body.msg).toBe('Bad request')
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

describe('/api/comments/comment_id', () => {
    test('DELETE: 204 Responds with no content', () => {
        return request(app)
        .delete('/api/comments/2')
        .expect(204)
    })

    test('DELETE: 404 Responds with an error message when passes a valid but non-existing comment id', () => {
        return request(app)
        .delete('/api/comments/9999')
        .expect(404)
        .then(({ body }) => {
            expect(body.msg).toBe('Comment does not exist')
        })
    })

    test('DELETE: 400 Responds with an error message when passes an invalid comment id', () => {
        return request(app)
        .delete('/api/comments/not-an-id')
        .expect(400)
        .then(({ body }) => {
            expect(body.msg).toBe('Bad request')
        })
    })
})

describe('/api/users', () => {
    test('GET: 200 Responds with an array of user objects', () => {
        return request(app)
        .get('/api/users')
        .expect(200)
        .then(({ body }) => {
            expect(body.users.length).toBe(4);
            body.users.forEach((user) => {
                expect(user).toMatchObject({
                    username: expect.any(String),
                    name: expect.any(String),
                    avatar_url: expect.any(String)
                });
            });
        })
    })

    test('GET: 200 Responds with object of user with specified username', () => {
        return request(app)
        .get('/api/users/butter_bridge')
        .expect(200)
        .then(({ body }) => {
            expect(body.user).toMatchObject({
                username: 'butter_bridge',
                name: 'jonny',
                avatar_url:
                  'https://www.healthytherapies.com/wp-content/uploads/2016/06/Lime3.jpg'             
            });
        })
    })

    test('GET: 404 Responds with error message when passed a valid but non-existing username', () => {
        return request(app)
        .get('/api/users/QueenBarbara')
        .expect(404)
        .then(({ body }) => {
            expect(body.msg).toBe('User does not exist')
        })
    })
})