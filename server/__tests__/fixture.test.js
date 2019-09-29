import request from 'supertest';
import app from '..';
import testDB from '../test-data/db-test';
import { admin, user, newFixture } from '../test-data';

let server, agent, adminToken, userToken, fLink;
const { start, stop } = testDB;

beforeAll(async (done) => {
  await start('mock-pl-fixtures');
  server = app.listen(3500, () => {
    agent = request.agent(server);
    done();
  });
});

afterAll(async () => {
  await stop();
  await server.close();
});

describe('Fixture admin routes', () => {
  beforeEach(async () => {
    const res = await agent.post('/api/v1/users/signin').send(admin);
    adminToken = res.body.data.token;
  });

  afterEach(async () => {
    await agent.post('/api/v1/users/logout');
  });

  it('should create a new fixture and return 201', async () => {
    const res = await agent.post('/api/v1/fixtures').set('Authorization', `Bearer ${adminToken}`).send(newFixture);
    fLink = res.body.data.fixtureLink;
    expect(res.statusCode).toEqual(201);
    expect(res.body.data._id).toBeTruthy();
    expect(res.body.data.homeTeam).toBe('Newcastle');
    expect(res.body.data.awayTeam).toBe('Chelsea');
    expect(res.body.data.fixtureDate).toBeTruthy();
    expect(res.body.data.status).toBe('pending');
  });

  it('should return 409 if fixture already exists', async () => {
    const res = await agent.post('/api/v1/fixtures').set('Authorization', `Bearer ${adminToken}`).send(newFixture);
    expect(res.statusCode).toEqual(409);
    expect(res.body.error).toBeTruthy();
  });

  it('should return 403 if user is not an admin', async () => {
    const userRes = await agent.post('/api/v1/users/signin').send(user);
    userToken = userRes.body.data.token;
    const res = await agent.post('/api/v1/fixtures').set('Authorization', `Bearer ${userToken}`).send(newFixture);
    expect(res.statusCode).toEqual(403);
    expect(res.body.error).toBeTruthy();
    expect(res.body.error).toBe('Access Denied');
  });

  it('should update a fixture and return 200', async () => {
    const res = await agent.put(`/api/v1/fixtures/${fLink}`).set('Authorization', `Bearer ${adminToken}`).send({ awayTeam: 'Leicester' });
    expect(res.statusCode).toEqual(200);
    expect(res.body.data.homeTeam).toBe('Newcastle');
    expect(res.body.data.awayTeam).toBe('Leicester');
    expect(res.body.data.status).toBe('pending');
  });

  it('should play and complete a fixture and return 200', async () => {
    const res = await agent.patch(`/api/v1/fixtures/play/${fLink}`).set('Authorization', `Bearer ${adminToken}`);
    expect(res.statusCode).toEqual(200);
    expect(res.body.data.status).toBe('completed');
    expect(res.body.data.homeTeam).toBeTruthy();
    expect(res.body.data.awayTeam).toBeTruthy();
  });

  it('should delete a specified fixture and return 200', async () => {
    const res = await agent.delete(`/api/v1/fixtures/${fLink}`).set('Authorization', `Bearer ${adminToken}`);
    expect(res.statusCode).toEqual(200);
    expect(res.body.data.message).toBe('Fixture has been deleted successfully');
  });
});

describe('Fixture user & admin routes', () => {
  beforeEach(async () => {
    const userRes = await agent.post('/api/v1/users/signin').send(user);
    userToken = userRes.body.data.token;
  });

  it('should get all fixtures and return 200', async () => {
    const res = await agent.get('/api/v1/fixtures').set('Authorization', `Bearer ${userToken}`);
    fLink = res.body.data[3].fixtureLink;
    expect(res.statusCode).toEqual(200);
    expect(res.body.data.length).toBeGreaterThan(7);
  });

  it('should get a specified fixture and return 200', async () => {
    const res = await agent.get(`/api/v1/fixtures?fixtureLink=${fLink}`).set('Authorization', `Bearer ${userToken}`);
    expect(res.statusCode).toEqual(200);
    expect(res.body.data.homeTeam).toBeTruthy();
    expect(res.body.data.awayTeam).toBeTruthy();
    expect(res.body.data.fixtureLink).toEqual(fLink);
  });

  it('should get fixtures with query status(pending or completed) and return 200', async () => {
    const res = await agent.get('/api/v1/fixtures?status=completed').set('Authorization', `Bearer ${userToken}`);
    expect(res.body.data).toContainEqual(expect.objectContaining({ status: 'completed' }));
    expect(res.body.data.length).toBeGreaterThan(2);
  });
});


describe('PUBLIC Robust Search route', () => {
  it('should return all the fixtures pertaining to a specified team and return 200', async () => {
    const res = await agent.get('/api/v1/search?term=chelsea');
    expect(res.statusCode).toEqual(200);
    expect(res.body.data[0].awayTeam).toBe('Chelsea');
    expect(Array.isArray(res.body.data)).toBeTruthy();
  });
});
