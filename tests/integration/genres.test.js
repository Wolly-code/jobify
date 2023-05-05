const request = require('supertest');
const { Genre } = require('../../models/genre');
const { User } = require('../../models/user');
let server

describe('/api/genres', () => {
    beforeEach(() => {
        server = require('../../index');
    });
    afterEach(async () => {
        server.close();
        await Genre.deleteMany({});

    });

    describe('GET /', () => {
        it('should return all genres', async () => {
            await Genre.collection.insertMany([
                { name: 'genre1' },
                { name: 'genre2' },
                { name: 'genre3' },
            ]);
            const response = await request(server).get('/api/genres');
            expect(response.status).toBe(200);
            expect(response.body.length).toBe(3);
            expect(response.body.some(g => g.name === 'genre1')).toBeTruthy();
            expect(response.body.some(g => g.name === 'genre2')).toBeTruthy();
        });
    });
    describe('GET /:id', () => {
        it('should return a genre if valid id is passed', async () => {
            const genre = new Genre({
                name: 'genre1'
            });
            await genre.save();
            const res = await request(server).get(`/api/genres/${genre._id}`);

            expect(res.status).toBe(200);
            expect(res.body.name).toEqual(genre.name);

        });
        it('should return a 404 error if invalid id is passed', async () => {
            const res = await request(server).get(`/api/genres/1`);
            expect(res.status).toBe(404);

        });

    });

    describe('POST / ', () => {
        it('Should return 401 if client is not logged in ', async () => {
            const res = await request(server).post('/api/genres').send({
                name: 'genre1',
            });
            expect((await res).statusCode).toBe(401);
        });
        it('Should return 400 if genre is less than 5 character ', async () => {
            const token = new User().generateAuthToken();
            const res = await request(server).post('/api/genres')
                .set('x-auth-token', token)
                .send({
                    name: '1',
                });
            expect((await res).statusCode).toBe(400);
        });
        it('Should return 400 if genre is more than 50 character ', async () => {
            const token = new User().generateAuthToken();
            const name = new Array(52).join('a');
            const res = await request(server).post('/api/genres')
                .set('x-auth-token', token)
                .send({
                    name: name,
                });
            expect((await res).statusCode).toBe(400);
        });
    })


});