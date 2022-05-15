module.exports = {
  preset: 'ts-jest',
  verbose: true,
  forceExit: true,
  resetModules: false,
  testEnvironment: 'node',
  testPathIgnorePatterns: ['./node_modules/', './tests/', './build/'],
  moduleFileExtensions: ['js', 'json', 'ts', 'tsx'],
  testMatch: ['**/*.test.js', '**/*.test.ts'],
  globals: {
    'ts-jest': {
      tsconfig: 'tsconfig.json',
      diagnostics: {
        warnOnly: true,
      },
    },
  },
  setupFilesAfterEnv: ['./src/test/test.setup.ts'],
  coveragePathIgnorePatterns: ['./tests/'],
  transform: {
    '^.+\\.ts?$': 'babel-jest',
  },
  testTimeout: 30000,
};