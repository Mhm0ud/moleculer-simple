import { OpenAPIV3 } from 'openapi-types';

export interface OpenAPIAction extends OpenAPIV3.OperationObject {
  $path: string;
}

export interface OpenAPIV3Document extends OpenAPIV3.Document {
  info: InfoObject;
}

interface InfoObject extends OpenAPIV3.InfoObject {
  'x-logo': {
    url: string;
    backgroundColor: string;
    altText: string;
  };
}
