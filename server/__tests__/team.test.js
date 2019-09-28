import request from 'supertest';
import app from '..';
import testDB from '../test-data/db-test';
import { admin, user, newTeam } from '../test-data';

let server, agent, adminToken, userToken;
const { start, stop } = testDB;

beforeAll(async (done) => {
  await start('mock-pl-teams');
  server = app.listen(3600, () => {
    agent = request.agent(server);
    done();
  });
});

beforeEach(async () => {
  const res = await agent.post('/api/v1/users/signin').send(admin);
  adminToken = res.body.data.token;
});

afterEach(async () => {
  await agent.post('/api/v1/users/logout');
});

afterAll(async () => {
  await stop();
  await server.close();
});

describe('Team admin routes', () => {
  it('should add a new team and return 201', async () => {
    const res = await agent.post('/api/v1/teams').set('Authorization', `Bearer ${adminToken}`).send(newTeam);
    expect(res.statusCode).toEqual(201);
    expect(res.body.data.teamName).toBeTruthy();
    expect(res.body.data.coach).toBeTruthy();
    expect(res.body.data._id).toBeTruthy();
  });

  it('should return 409 if team already exists', async () => {
    const res = await agent.post('/api/v1/teams').set('Authorization', `Bearer ${adminToken}`).send(newTeam);
    expect(res.statusCode).toEqual(409);
    expect(res.body.error).toBeTruthy();
  });

  it('should return 403 if user is not an admin', async () => {
    await agent.post('/api/v1/users/logout');
    const userRes = await agent.post('/api/v1/users/signin').send(user);
    userToken = userRes.body.data.token;
    const res = await agent.post('/api/v1/teams').set('Authorization', `Bearer ${userToken}`).send(newTeam);
    expect(res.statusCode).toEqual(403);
    expect(res.body.error).toBeTruthy();
    expect(res.body.error).toBe('Access Denied');
  });

  it('should update a team and return 200', async () => {
    const res = await agent.put('/api/v1/teams/chelsea').set('Authorization', `Bearer ${adminToken}`)
      .send({ coach: 'Frank Lampard', noOfPlayers: 60 });
    expect(res.statusCode).toEqual(200);
    expect(res.body.data.coach).toBe('frank lampard');
    expect(res.body.data.noOfPlayers).toEqual(60);
    expect(res.body.data.teamName).toEqual('chelsea');
  });

  it('should delete a team successfully and return 200', async () => {
    const teamName = 'southampton';
    const res = await agent.delete(`/api/v1/teams/${teamName}`).set('Authorization', `Bearer ${adminToken}`);
    expect(res.statusCode).toEqual(200);
    expect(res.body.data.message).toEqual(`${teamName} has been deleted successfully`);
  });
});

describe('Team user & admin routes', () => {
  it('should get all teams and return 200', async () => {
    await agent.post('/api/v1/users/logout');
    const userRes = await agent.post('/api/v1/users/signin').send(user);
    userToken = userRes.body.data.token;
    const res = await agent.get('/api/v1/teams').set('Authorization', `Bearer ${userToken}`);
    expect(res.statusCode).toEqual(200);
    expect(res.body.data.length).toBeGreaterThan(7);
  });

  it('should return a team with the query name and return 200', async () => {
    const res = await agent.get('/api/v1/teams?teamName=Liverpool').set('Authorization', `Bearer ${adminToken}`);
    expect(res.statusCode).toEqual(200);
    expect(res.body.data[0]._id).toBeTruthy();
    expect(res.body.data[0].teamName).toEqual('liverpool');
  });

  it('should return a team with the query coach and return 200', async () => {
    await agent.post('/api/v1/users/logout');
    const userRes = await agent.post('/api/v1/users/signin').send(user);
    userToken = userRes.body.data.token;
    const res = await agent.get('/api/v1/teams?coach=Marco Silva').set('Authorization', `Bearer ${userToken}`);
    expect(res.statusCode).toEqual(200);
    expect(res.body.data[0]._id).toBeTruthy();
    expect(res.body.data[0].teamName).toEqual('everton');
    expect(res.body.data[0].coach).toEqual('marco silva');
  });
});
