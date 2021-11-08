import { ServiceSchema } from 'moleculer';

const ProductOpenapi = {
  components: {
    schemas: {
      Product: {
        type: 'object',
        properties: {
          name: {
            type: 'string',
            description: 'Product title',
          },
          category: {
            type: 'string',
            description: 'Product category',
          },
          price: {
            type: 'string',
            description: 'Product price',
          },
        },
        example: {
          name: 'The Bla Bla Product',
          category: 'Bla Bla',
          price: 777,
        },
      },
    },
  },
};

const CreateOpenapi = {
  $path: 'post products',
  summary: 'Create Product',
  tags: ['Products'],
  responses: {
    200: {
      description: 'Status 200',
      content: {
        'application/json': {
          schema: {
            $ref: '#/components/schemas/Product',
          },
        },
      },
    },
    401: {
      // TODO
      $ref: '#/components/responses/UnauthorizedErrorBasic',
    },
  },
  requestBody: {
    required: true,
    content: {
      'application/json': {
        schema: {
          type: 'object',
          required: ['url', 'topic'],
          properties: {
            name: {
              type: 'string',
              description: 'Product title',
              required: true,
            },
            category: {
              type: 'string',
              description: 'Product category',
            },
            price: {
              type: 'string',
              description: 'Product price',
              required: true,
            },
          },
        },
      },
    },
  },
};

export const ProductsOpenapi: ServiceSchema = {
  name: 'products',
  settings: {
    openapi: ProductOpenapi,
  },
  actions: {
    create: {
      openapi: CreateOpenapi,
    },
  },
};
