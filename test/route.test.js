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

        it('Should return 501', async () => {
            const response = await request(server).get('/formifomi');
            expect(response.status).toBe(501);
        });
    });

    describe('TRY POST', () => {
        it('Should return 200', async () => {
            const response = await request(server).get('/auth');
            expect(response.status).toBe(200);
        });

        it('Should return 501', async () => {
            const response = await request(server).post('/formifomi');
            expect(response.status).toBe(501);
        });
    });
});
