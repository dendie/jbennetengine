const request = require('supertest');
const app = require('../index');

test('returns a list of users', async () => {
  const response = await request(app).get('/users');
  expect(response.status).toBe(200);
  expect(response.body).toEqual([    { id: 1, name: 'John' }  ]);
});
