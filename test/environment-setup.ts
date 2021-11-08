import { GenericObject } from 'moleculer';
import dotenv from 'dotenv';
dotenv.config({ path: './deploy/docker/.env' });

// Use random ports during tests
const env = process.env as GenericObject;
env.PORT = 0;
