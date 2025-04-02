// jest.config.ts
import nextJest from 'next/jest.js';

const createJestConfig = nextJest({
  dir: './',
});

const customJestConfig = {
  setupFilesAfterEnv: ['<rootDir>/jest.setup.ts'],
  testEnvironment: 'jsdom',
  moduleDirectories: ['node_modules', '<rootDir>/'],
  transformIgnorePatterns: [
    "/node_modules/(?!uuid|pouchdb-browser).+\\.js$"
  ],
  moduleNameMapper: {
    '^@/(.*)$': '<rootDir>/src/$1',
  },  
};

export default createJestConfig(customJestConfig);
