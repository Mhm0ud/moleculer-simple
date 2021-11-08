const { ServiceBroker } = require('moleculer');
const { ValidationError } = require('moleculer').Errors;
const TestService = require('../../../services/products.service');

describe("Unit Test 'products' service", () => {
  const broker = new ServiceBroker({ logger: false });
  broker.createService(TestService);

  beforeAll(() => broker.start());
  afterAll(() => broker.stop());

  describe("Test 'products.create' action", () => {
    it('should reject an ValidationError', () => {
      expect(broker.call('products.create')).rejects.toBeInstanceOf(
        ValidationError
      );
    });
  });
});
