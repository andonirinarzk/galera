const request = require('supertest');
const { server, closeServer } = require('../server');

describe('MAIN ROUTE', () => {
    beforeAll(() => {
        // Faites quelque chose avant tous les tests si nécessaire
    });

    afterAll(async () => {
        await closeServer();
    });

    describe('TRY GET', () => {
        it('Should return 200', async () => {
            const response = await request(server).get('/');
            expect(response.status).toBe(200);
        });
        it('Should return 200', async () => {
            const response = await request(server).get('/formations');
            expect(response.status).toBe(200);
        });
        it('Should return 200', async () => {
            const response = await request(server).get('/modules');
            expect(response.status).toBe(200);
        });
        it('Should return 401', async () => {
            const response = await request(server).get('/eleves');
            expect(response.status).toBe(401);
        });
        it('Should return 401', async () => {
            const response = await request(server).get('/formateurs');
            expect(response.status).toBe(401);
        });

        it('Should return 401', async () => {
            const response = await request(server).get('/notations');
            expect(response.status).toBe(401);
        });
        it('Should return 501', async () => {
            const response = await request(server).get('/formifomi');
            expect(response.status).toBe(501);
        });
    });

    describe('TRY POST', () => {
        it('Should return 200', async () => {
            const response = await request(server).post('/login');
            expect(response.status).toBe(200);
        });
        it('Should return 401', async () => {
            const response = await request(server).post('/register');
            expect(response.status).toBe(401);
        });
        it('Should return 501', async () => {
            const response = await request(server).post('/formifomi');
            expect(response.status).toBe(501);
        });
    });
    describe('TRY PUT', () => {
        it('Should return 401', async () => {
            const response = await request(server).put('/formations');
            expect(response.status).toBe(401);
        });

        it('Should return 401', async () => {
            const response = await request(server).put('/eleves');
            expect(response.status).toBe(401);
        });
        it('Should return 401', async () => {
            const response = await request(server).put('/formateurs');
            expect(response.status).toBe(401);
        });
        it('Should return 401', async () => {
            const response = await request(server).put('/modules');
            expect(response.status).toBe(401);
        });
        it('Should return 401', async () => {
            const response = await request(server).put('/notations');
            expect(response.status).toBe(401);
        });
        it('Should return 501', async () => {
            const response = await request(server).put('/formifomi');
            expect(response.status).toBe(501);
        });
    });
    describe('TRY DELETE', () => {
        it('Should return 401', async () => {
            const response = await request(server).delete('/formateurs');
            expect(response.status).toBe(401);
        });
        it('Should return 501', async () => {
            const response = await request(server).delete('/formifomi');
            expect(response.status).toBe(501);
        });
    });
});
