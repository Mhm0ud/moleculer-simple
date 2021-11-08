import request from 'supertest';

let params = {
  name: 'XXXX',
  category: 'XXXX',
  price: 123,
};
const invalidParams = {
  parentId: 'Test-ParentId',
  treeNodeLevel: 'Test-treeNodeLevel',
};
let body = {
  consumerKey: 'fc503550-a00f-11ea-bca1-616d12617296',
  consumerSecret: '118bbaa5-ab95-4ee2-988b-950beef8ff84',
};
const baseURL = process.env.MP_BASE_URL;
const invalidToken = 'Invalid Token';
let token: string = '';

/* Generate token */
async function getToken(body: object): Promise<void> {
  try {
    const response = await request(baseURL)
      .post('/token')
      .send(body)
      .then((res: any) => {
        return res;
      })
      .catch(err => {
        throw Error(err);
      });
    token = response.body.channel.token;
  } catch (err) {
    throw Error(err);
  }
}

jest.setTimeout(30000);
describe('Integration Test "products" service ', () => {
  beforeAll(async () => {
    /* Used for generate bearer token */
    await getToken(body);
  });

  it("Test '/products' for 200 response code ", async () => {
    return request(baseURL)
      .post('/products')
      .query(params)
      .then((res: any) => {
        expect(res.statusCode).toBe(200);
      })
      .catch(err => {
        throw Error(err);
      });
  });
});
