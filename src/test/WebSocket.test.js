/* eslint-disable no-undef */
import chai, { expect } from 'chai';
import chaiHttp from 'chai-http';
import { step } from 'mocha-steps';
import faker from 'faker';
import supertest from 'supertest';
import io from 'socket.io-client';
import { Server } from 'socket.io';
import httpServer from '../server.js';
import app from '../app.js';
import { WebSockets } from '../sockets/WebSockets.js';
import makeAssociations from '../data-access/associations.js';
import database from '../data-access/database.js';

const should = chai.should();
chai.use(chaiHttp);
const request = supertest(app);
let cookie;
let wsClient;
let secondUser;

describe('Websocket httpServer tests', () => {
    step('Initialize Database', async () => {
        makeAssociations();
        await database.sync({ force: true });
    });
    before((done) => {
        const ioServer = new Server(httpServer);
        WebSockets(ioServer);
        done();
    });

    describe('WebSocket Client Mock', () => {
        const userPass = faker.internet.password(10, true);
        const mockUser = {
            firstName: faker.name.firstName(),
            lastName: faker.name.lastName(),
            email: faker.internet.email(),
            password: userPass,
            confirmPassword: userPass,
        };
        step('Create a User', async () => {
            await request
                .post('/auth/signup')
                .set('content-type', 'application/json')
                .send(mockUser)
                .then((res) => {
                    res.should.have.status(200);
                    expect(res).to.have.cookie('origin');
                    cookie = res.header['set-cookie'];
                });
        });
        step('Create a 2nd User', async () => {
            const secondUserPass = faker.internet.password(10, true);
            const secondMockUser = {
                firstName: faker.name.firstName(),
                lastName: faker.name.lastName(),
                email: faker.internet.email(),
                password: secondUserPass,
                confirmPassword: secondUserPass,
            };
            await request
                .post('/auth/signup')
                .set('content-type', 'application/json')
                .send(secondMockUser)
                .then((res) => {
                    res.should.have.status(200);
                    expect(res).to.have.cookie('origin');
                    secondUser = res.body;
                });
        });
        step('Log In a User', async () => {
            const loginObj = {
                email: mockUser.email,
                password: mockUser.password,
            };
            await request
                .post('/auth/login')
                .set('Content-Type', 'application/json')
                .send(loginObj)
                .then((res) => {
                    res.should.have.status(200);
                    cookie = res.header['set-cookie'];
                });
        });
        step('Connect Socket', () => {
            const options = {
                transportOptions: {
                    polling: {
                        extraHeaders: {
                            Cookie: cookie,
                        },
                    },
                },
            };
            wsClient = io('http://localhost:8081', options);
        });
        step('PING Test', (done) => {
            wsClient.emit('PING', '');
            wsClient.on('PONG', (data) => {
                expect(data).to.be.eq('PONG');
                done();
            });
        }).timeout(5000);
        step('Authentication Test', (done) => {
            wsClient.emit('authentication');
            wsClient.on('authorized', () => {
                done();
            });
            wsClient.on('unauthorized', () => {
                return false;
            });
        });
        step('Send Request', (done) => {
            wsClient.emit('newRequest', secondUser.id);
            wsClient.on('incomingRequest', () => {
                done();
            });
        });
        // Find the requestId
        step('Deny Request', (done) => {
            done();
        });
        step('Accept Request', (done) => {
            done();
        });
        step('Send Message', (done) => {
            done();
        });
    });
});
