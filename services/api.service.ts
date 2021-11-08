import { Service, Context } from 'moleculer';
import { Service as DService, Action, Method } from 'moleculer-decorators';
import ApiGateway from 'moleculer-web';
import { IncomingRequest } from '../utilities/types';

@DService({
  name: 'api',
  mixins: [ApiGateway],
  // More info about settings: https://moleculer.services/docs/0.14/moleculer-web.html
  settings: {
    port: process.env.PORT || 3000,

    routes: [
      {
        path: '/api',
        whitelist: [
          // Access to any actions in all services under "/api" URL
          '**',
        ],
        // Route-level Express middlewares. More info: https://moleculer.services/docs/0.14/moleculer-web.html#Middlewares
        use: [],
        // Enable/disable parameter merging method. More info: https://moleculer.services/docs/0.14/moleculer-web.html#Disable-merging
        mergeParams: true,

        // Enable authentication. Implement the logic into `authenticate` method. More info: https://moleculer.services/docs/0.14/moleculer-web.html#Authentication
        authentication: false,

        // Enable authorization. Implement the logic into `authorize` method. More info: https://moleculer.services/docs/0.14/moleculer-web.html#Authorization
        authorization: false,

        // The auto-alias feature allows you to declare your route alias directly in your services.
        // The gateway will dynamically build the full routes from service schema.
        autoAliases: true,

        aliases: {},
        /**
           * Before call hook. You can check the request.
           * @param {Context} ctx
           * @param {Object} route
           * @param {IncomingRequest} req
           * @param {ServerResponse} res
           * @param {Object} data
          onBeforeCall(ctx: Context<any,{userAgent: string}>,
           route: object, req: IncomingRequest, res: ServerResponse) {
            Set request headers to context meta
            ctx.meta.userAgent = req.headers["user-agent"];
          },
           */

        /**
           * After call hook. You can modify the data.
           * @param {Context} ctx
           * @param {Object} route
           * @param {IncomingRequest} req
           * @param {ServerResponse} res
           * @param {Object} data
           *
           onAfterCall(ctx: Context, route: object, req: IncomingRequest, res: ServerResponse, data: object) {
          // Async function which return with Promise
          return doSomething(ctx, res, data);
        },
           */

        // Calling options. More info: https://moleculer.services/docs/0.14/moleculer-web.html#Calling-options
        callingOptions: {},

        bodyParsers: {
          json: {
            strict: false,
            limit: '1MB',
          },
          urlencoded: {
            extended: true,
            limit: '1MB',
          },
        },

        // Mapping policy setting. More info: https://moleculer.services/docs/0.14/moleculer-web.html#Mapping-policy
        // Available values: "all", "restrict"
        mappingPolicy: 'all',

        cors:
          process.env.NODE_ENV === 'production'
            ? false
            : {
                // Configures the Access-Control-Allow-Origin CORS header.
                origin: ['http://localhost*'],
                // Configures the Access-Control-Allow-Methods CORS header.
                methods: ['POST', 'GET', 'PUT', 'DELETE', 'OPTION'],
                // Configures the Access-Control-Allow-Headers CORS header.
                allowedHeaders: [
                  '*',
                  'Origin',
                  'X-Requested-With',
                  'Content-Type',
                  'Accept',
                  'Authorization',
                ],
                // Configures the Access-Control-Expose-Headers CORS header.
                exposedHeaders: [],
                // Configures the Access-Control-Allow-Credentials CORS header.
                credentials: true,
                // Configures the Access-Control-Max-Age CORS header.
                maxAge: 3600,
              },

        // Enable/disable logging
        logging: true,
      },
    ],
    // Do not log client side errors (does not log an error response when the error.code is 400<=X<500)
    log4XXResponses: false,
    // Logging the request parameters. Set to any log level to enable it. E.g. "info"
    logRequestParams: null,
    // Logging the response data. Set to any log level to enable it. E.g. "info"
    logResponseData: null,
    // Serve assets from "public" folder
    assets: {
      folder: 'public',
      // Options to `server-static` module
      options: {},
    },
  },
})
export default class APIService extends Service {
  @Action({
    visibility: 'public',
  })
  // listAliases() {}

  /**
   * Authenticate the request. It check the `Authorization` token value in the request header.
   * Check the token value & resolve the user by the token.
   * The resolved user will be available in `ctx.meta.user`
   *
   * PLEASE NOTE, IT'S JUST AN EXAMPLE IMPLEMENTATION. DO NOT USE IN PRODUCTION!
   *
   * @param {Context} ctx
   * @param {any} route
   * @param {IncomingRequest} req
   * @returns {Promise}
   */

  /**
   * Authorize the request. Check that the authenticated user has right to access the resource.
   *
   * PLEASE NOTE, IT'S JUST AN EXAMPLE IMPLEMENTATION. DO NOT USE IN PRODUCTION!
   *
   * @param {Context} ctx
   * @param {Object} route
   * @param {IncomingRequest} req
   * @returns {Promise}
   */
  @Method
  async authorize(
    ctx: Context<
      any,
      {
        user: string;
      }
    >,
    route: { [key: string]: undefined },
    req: IncomingRequest
  ): Promise<any> {
    // Get the authenticated user.
    const user = ctx.meta.user;
    // It check the `auth` property in action schema.
    if (req.$action.auth === 'required' && !user) {
      throw new ApiGateway.Errors.UnAuthorizedError('NO_RIGHTS', {
        error: 'Unauthorized',
      });
    }
  }
}
