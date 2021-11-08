import { IncomingMessage } from 'http';

import { ActionSchema, Context, GenericObject } from 'moleculer';

/**
 *  Incoming Request Definition
 *
 * @exports
 * @interface IncomingRequest
 */
export interface IncomingRequest extends IncomingMessage {
  $params: GenericObject;
  $meta?: MetaParams<unknown>;
  $endpoint: {
    action: {
      auth: string;
    };
  };
  $action: ActionSchema;
  $ctx: Context<
    unknown,
    {
      responseType: string;
      $responseHeaders: GenericObject;
      $statusCode: number;
    }
  >;
}

/**
 * MetaParams
 * @exports
 * @interface MetaParams
 */
export interface MetaParams<T> {
  $statusCode?: number;
  $statusMessage?: string;
  $responseType?: string;
  token?: string;
  user?: T;
}
