import { mockTechPostsBody } from "./mocks/TechPosts.mock";
import { mockHealthPostsBody } from "./mocks/HealthPosts.mock";
import { mockUniqueTechAndHealthPostsBody } from "./mocks/UniqueTechAndHealthPosts.mock";
import { sortArrayBy } from "../src/helpers";
import { SortBy } from "../src/schemas";

const server = require('../server');
const supertest = require('supertest');
const sinon = require('sinon');
const helpers = require('../src/helpers');

const appTest = supertest(server);

describe('Integration tests', () => {

  afterEach(() => {
    sinon.restore();
  });

  it('GET /api/ping', async () => {
    const expected = { status: 200, body: { success: true } };
    const res = await appTest.get('/api/ping');
    expect(res.status).toEqual(expected.status);
    expect(res.body).toEqual(expected.body);
  });

  it('GET /api/posts passes if one tag is defined in query', async () => {
    const expected = { status: 200, data: mockTechPostsBody };
    sinon.stub(helpers, 'execConcurrentRequests').resolves([expected]);
    const res = await appTest.get('/api/posts').query({ tags: 'tech' });
    console.log(res.body);
    expect(res.status).toEqual(200);
    expect(res.body).toEqual(expected.data);
  });

  it('GET /api/posts passes if two tags are defined in query', async () => {
    const mockTechRes = { status: 200, data: mockTechPostsBody };
    const mockHealthRes = { status: 200, data: mockHealthPostsBody };
    sinon.stub(helpers, 'execConcurrentRequests').resolves([mockTechRes, mockHealthRes]);
    const expected = {
      posts: sortArrayBy(mockUniqueTechAndHealthPostsBody.posts, SortBy.id, 1)
    }
    const res = await appTest.get('/api/posts').query({ tags: 'tech,health' });
    expect(res.status).toEqual(200);
    expect(res.body).toEqual(expected);
  });

  it('GET /api/posts passes if two tags and sort by are defined in query', async () => {
    const mockTechRes = { status: 200, data: mockTechPostsBody };
    const mockHealthRes = { status: 200, data: mockHealthPostsBody };
    sinon.stub(helpers, 'execConcurrentRequests').resolves([mockTechRes, mockHealthRes]);
    const expected = {
      posts: sortArrayBy(mockUniqueTechAndHealthPostsBody.posts, SortBy.reads, 1)
    }
    const res = await appTest.get('/api/posts').query({ tags: 'tech,health', sortBy: 'reads' });
    expect(res.status).toEqual(200);
    expect(res.body).toEqual(expected);
  });

  it('GET /api/posts passes if two tags, sort by, and direction are defined in query', async () => {
    const mockTechRes = { status: 200, data: mockTechPostsBody };
    const mockHealthRes = { status: 200, data: mockHealthPostsBody };
    sinon.stub(helpers, 'execConcurrentRequests').resolves([mockTechRes, mockHealthRes]);
    const expected = {
      posts: sortArrayBy(mockUniqueTechAndHealthPostsBody.posts, SortBy.likes, -1)
    }
    const res = await appTest.get('/api/posts').query({ tags: 'tech,health', sortBy: 'likes', direction: 'desc' });
    expect(res.status).toEqual(200);
    expect(res.body).toEqual(expected);
  });
});
