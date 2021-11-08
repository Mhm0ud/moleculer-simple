import { ServiceSchema } from 'moleculer';

export const ProductsValidation: ServiceSchema = {
  name: 'products',
  actions: {
    create: {
      params: {
        name: { type: 'string' },
        category: { type: 'string', optional: true },
        price: { type: 'number' },
        $$strict: true,
      },
    },
  },
};
