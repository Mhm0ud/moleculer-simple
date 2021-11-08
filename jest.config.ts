import type { Config } from '@jest/types';

// Sync object
const config: Config.InitialOptions = {
  setupFiles: ['<rootDir>/test/environment-setup.ts'],
  coverageDirectory: '<rootDir>/coverage',
  testEnvironment: 'node',
  moduleFileExtensions: ['ts', 'tsx', 'js'],
  transform: {
    '^.+\\.(ts|tsx)$': 'ts-jest',
  },
  testMatch: ['**/*.spec.(ts|js)'],
  globals: {
    'ts-jest': {
      tsconfig: 'tsconfig.json',
    },
  },
};

export default config;
