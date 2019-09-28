import request from 'supertest';
import app from '..';
import testDB from '../test-data/db-test';
import { admin, user, newUser } from '../test-data';

let server, agent, adminToken, userToken;
const { start, stop } = testDB;


beforeAll(async (done) => {
  await start('mock-pl-users');
  server = app.listen(3400, () => {
    agent = request.agent(server);
    done();
  });
});

afterAll(async () => {
  await stop();
  await server.close();
});


describe('Authentication routes', () => {
  it('should signup a new user with status 201', async () => {
    const res = await agent.post('/api/v1/users/signup').send(newUser);
    expect(res.statusCode).toEqual(201);
    expect(res.body.data.token).toBeTruthy();
    expect(res.body.data.email).toBeTruthy();
    expect(res.body.data.firstName).toBeTruthy();
  });

  it('should return 409 if user already exists', async () => {
    const res = await agent.post('/api/v1/users/signup').send(newUser);
    expect(res.statusCode).toEqual(409);
    expect(res.body.error).toBeTruthy();
  });

  it('should return 400 if a required field is omitted', async () => {
    const res = await agent.post('/api/v1/users/signup').send({ ...newUser, firstName: '' });
    expect(res.statusCode).toEqual(400);
    expect(res.body.error).toEqual('First name is required');
  });

  it('should sign in an existing user and return 200', async () => {
    const res = await agent.post('/api/v1/users/signin').send(user);
    expect(res.statusCode).toEqual(200);
    expect(res.body.data.token).toBeTruthy();
    expect(res.body.data._id).toBeTruthy();
    expect(res.body.data.isAdmin).toBeFalsy();
  });

  it('should not  sign in a non-existing user and return 401', async () => {
    const res = await agent.post('/api/v1/users/signin').send({ ...user, email: 'jasper@node.com' });
    expect(res.statusCode).toEqual(401);
    expect(res.body.error).toEqual('Invalid Credentials');
  });

  it('should logout a logged in user and return 200', async () => {
    await agent.post('/api/v1/users/signin').send(user);
    const res = await agent.post('/api/v1/users/logout');
    expect(res.statusCode).toEqual(200);
    expect(res.body.data.message).toEqual('You have logged out successfully');
  });
});

describe('Admin User routes', () => {
  beforeEach(async () => {
    const res = await agent.post('/api/v1/users/signin').send(admin);
    adminToken = res.body.data.token;
  });

  afterEach(async () => {
    await agent.post('/api/v1/users/logout');
  });

  it('should get all users and return 200', async () => {
    const res = await agent.get('/api/v1/users').set('Authorization', `Bearer ${adminToken}`);
    expect(res.statusCode).toEqual(200);
    expect(res.body.data.length).toBeGreaterThan(7);
  });

  it('should return a 403 if user is not an admin', async () => {
    const resUser = await agent.post('/api/v1/users/signin').send(user);
    userToken = resUser.body.data.token;
    const res = await agent.get('/api/v1/users').set('Authorization', `Bearer ${userToken}`);
    expect(res.statusCode).toEqual(403);
    expect(res.body.error).toEqual('Access Denied');
  });

  it('should make user an admin and return 200', async () => {
    const res = await agent.patch('/api/v1/users/admin/crypt@node.com').set('Authorization', `Bearer ${adminToken}`);
    expect(res.statusCode).toEqual(200);
    expect(res.body.data.isAdmin).toBeTruthy();
    expect(res.body.data.email).toEqual('crypt@node.com');
  });
});
