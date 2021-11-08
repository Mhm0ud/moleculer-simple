import fs from 'fs';
import { ServerResponse } from 'http';

import _ from 'lodash';
import {
  ActionSchema,
  Errors,
  ServiceSchema,
  Context,
  GenericObject,
} from 'moleculer';

import { IncomingRequest } from '../types';
import { OpenAPIAction, OpenAPIV3Document } from '../../types/OpenAPI';
import pkg from '../../package.json';

const { MoleculerServerError } = Errors;

/**
 * OpenAPI mixin
 *
 * @export
 * @returns {ServiceSchema}
 */
export function OpenApiMixin(): ServiceSchema {
  const mixinOptions: {
    schema: OpenAPIV3Document;
    routeOptions: { path: string };
  } = {
    routeOptions: {
      path: '/openapi',
    },
    schema: null,
  };

  let shouldUpdateSchema = true;
  let schema: OpenAPIV3Document = null;
  let schemaPrivate: OpenAPIV3Document = null;

  return {
    name: 'openapi',
    events: {
      '$services.changed': function (): void {
        this.invalidateOpenApiSchema();
      },
    },

    methods: {
      /**
       * Invalidate the generated OpenAPI schema
       */
      invalidateOpenApiSchema(): void {
        shouldUpdateSchema = true;
      },

      /**
       * Write static files in not created
       */
      async generateOpenApiFiles(ctx: Context): Promise<void> {
        if (shouldUpdateSchema || !schema) {
          // Create new server & regenerate GraphQL schema
          this.logger.info('♻ Regenerate OpenAPI/Swagger schema...');

          schema = await this.generateOpenAPISchema(ctx, { bearerOnly: true });
          schemaPrivate = await this.generateOpenAPISchema(ctx, {});
          shouldUpdateSchema = false;

          if (process.env.NODE_ENV !== 'production') {
            await fs.writeFileSync(
              './openapi.json',
              JSON.stringify(schema, null, 4),
              'utf8'
            );

            await fs.writeFileSync(
              './openapi-private.json',
              JSON.stringify(schemaPrivate, null, 4),
              'utf8'
            );
          }
        }
      },

      /**
       * Generate OpenAPI Schema
       */
      async generateOpenAPISchema(
        ctx: Context,
        {
          bearerOnly,
        }: {
          bearerOnly: boolean;
        }
      ): Promise<OpenAPIV3Document> {
        try {
          const res = _.defaultsDeep(mixinOptions.schema, {
            openapi: '3.0.3',

            // https://swagger.io/specification/#infoObject
            info: {
              title: `${pkg.name.toUpperCase()} API Documentation`,
              'x-logo': {
                url: 'https://knawat.com/wp-content/uploads/2017/12/logo.png',
                backgroundColor: '#ef6530',
                altText: 'Knawat logo',
              },
              version: pkg.version,
              termsOfService: 'https://knawat.com/terms-and-conditions/',
              contact: {
                email: 'support@knawat.com',
                url: 'https://developer.knawat.com',
              },
              license: {
                name: `Knawat Copyright © - 2017 -  ${new Date().getFullYear()}`,
                url: 'https://knawat.com/terms-and-conditions/',
              },
              description: '',
            },

            // https://swagger.io/specification/#serverObject
            servers: [
              {
                description: 'Sandbox Server',
                url: 'https://dev.mp.knawat.io/api',
              },
              {
                description: 'Production Server',
                url: 'https://mp.knawat.io/api',
              },
            ],

            // https://swagger.io/specification/#componentsObject
            components: {
              responses: {
                UnauthorizedErrorToken: {
                  description:
                    'Access token is missing or invalid, request new one',
                },
                UnauthorizedErrorBasic: {
                  description:
                    'Authentication information is missing or invalid',
                },
                404: { description: 'Entity not found.' },
                500: {
                  description: 'Internal Error.',
                  content: {
                    'application/json': {
                      schema: { $ref: '#/components/schemas/Error' },
                    },
                  },
                },
              },
              securitySchemes: {
                bearerAuth: {
                  type: 'http',
                  scheme: 'bearer',
                  bearerFormat: 'JWT',
                },
                basicAuth: {
                  description:
                    'Knawat provide extra endpoint for private use, let us know if you really need access to Knawat Private APIs.',
                  type: 'http',
                  scheme: 'basic',
                },
              },
              schemas: {
                Error: {
                  type: 'object',
                  required: ['message'],
                  properties: {
                    status: {
                      type: 'string',
                    },
                    message: {
                      type: 'string',
                    },
                  },
                  description:
                    'This general error structure is used throughout this API.',
                  example: {
                    message: 'SKU(s) out of stock.',
                  },
                },
              },
            },

            // https://swagger.io/specification/#pathsObject
            paths: {},

            // https://swagger.io/specification/#securityRequirementObject
            security: [],

            // https://swagger.io/specification/#tagObject
            tags: [],

            // https://swagger.io/specification/#externalDocumentationObject
            externalDocs: {
              description: 'Find more info here',
              url: 'https://docs.knawat.io',
            },
          });

          const services = await ctx.broker.call<
            ServiceSchema[],
            {
              withActions: true;
            }
          >('$node.services', {
            withActions: true,
          });

          services.forEach((service: ServiceSchema) => {
            // --- COMPILE SERVICE-LEVEL DEFINITIONS ---
            if (service.settings.openapi) {
              _.merge(res, service.settings.openapi);
            }

            // --- COMPILE ACTION-LEVEL DEFINITIONS ---
            _.forIn(service.actions, (action: ActionSchema) => {
              if (!action.openapi && !_.isObject(action.openapi)) {
                return;
              }

              // Hide basic endpoint
              if (
                bearerOnly &&
                action.openapi?.security?.length &&
                !action.openapi?.security.some(
                  (security: { [key: string]: string }) => security.bearerAuth
                )
              ) {
                return;
              }

              // console.log(action.openapi.security[0].bearerAuth);
              const def: OpenAPIAction & OpenAPIAction[] = _.cloneDeep(
                action.openapi
              );
              if (def?.length > 0) {
                def.forEach((defElement: OpenAPIAction) => {
                  let method: string;
                  let routePath: string;
                  if (defElement.$path) {
                    const path: string[] = defElement.$path.split(' ');
                    method = path[0].toLowerCase();
                    routePath = path[1];
                    delete defElement.$path;
                  }

                  _.set(res.paths, [routePath, method], defElement);
                });
              } else {
                let method: string;
                let routePath: string;
                if (def.$path) {
                  const path: any = def.$path.split(' ');
                  method = path[0].toLowerCase();
                  routePath = path[1];
                  delete def.$path;
                }

                _.set(res.paths, [routePath, method], def);
              }
            });
          });

          return res;
        } catch (err) {
          throw new MoleculerServerError(
            'Unable to compile OpenAPI schema',
            500,
            'UNABLE_COMPILE_OPENAPI_SCHEMA',
            { err }
          );
        }
      },
    },

    created(): void {
      const route = _.defaultsDeep(mixinOptions.routeOptions, {
        path: '/openapi',
        // Set CORS headers
        cors: {
          // Configures the Access-Control-Allow-Origin CORS header.
          origin: '*',
          // Configures the Access-Control-Allow-Methods CORS header.
          methods: ['GET', 'POST', 'PUT', 'DELETE'],
          // Configures the Access-Control-Allow-Headers CORS header.
          allowedHeaders: [
            '*',
            'Origin',
            'X-Requested-With',
            'Content-Type',
            'Accept',
            'Authorization',
            'Access-Control-Allow-*',
          ],
          // Configures the Access-Control-Expose-Headers CORS header.
          exposedHeaders: [],
          // Configures the Access-Control-Allow-Credentials CORS header.
          credentials: true,
          // Configures the Access-Control-Max-Age CORS header.
          maxAge: 3600,
        },

        aliases: {
          '/openapi.json': async function (
            req: IncomingRequest,
            res: ServerResponse
          ) {
            const ctx = req.$ctx;
            // Regenerate static files
            await this.generateOpenApiFiles(ctx);

            ctx.meta.responseType = 'application/json';

            return this.sendResponse(req, res, schema);
          },
          '/openapi-private.json': async function (
            req: IncomingRequest,
            res: ServerResponse
          ): Promise<GenericObject> {
            const auth = {
              login: process.env.BASIC_USER,
              password: process.env.BASIC_PASS,
            };

            // parse login and password from headers
            const b64auth =
              (req?.headers?.authorization || '').split(' ')[1] || '';
            const [login, password] = Buffer.from(b64auth, 'base64')
              .toString()
              .split(':');

            const ctx = req.$ctx;

            // Verify login and password are set and correct
            if (
              login &&
              password &&
              login === auth.login &&
              password === auth.password
            ) {
              // Regenerate static files
              await this.generateOpenApiFiles(ctx);

              ctx.meta.responseType = 'application/json';
              return this.sendResponse(req, res, schemaPrivate);
            }

            // Access denied...
            ctx.meta.$responseHeaders = {
              'WWW-Authenticate': 'Basic realm="401"',
            };
            ctx.meta.$statusCode = 401;

            return this.sendResponse(req, res, 'Authentication required');
          },
        },

        mappingPolicy: 'restrict',
      });

      // Add route
      this.settings.routes.unshift(route);
    },

    started(): Promise<void> {
      return this.logger.info(
        `📜 OpenAPI Docs server is available at ${mixinOptions.routeOptions.path}`
      );
    },
  };
}
