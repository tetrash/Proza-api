module.exports = {
  preset: 'ts-jest',
  testEnvironment: 'node',
  modulePathIgnorePatterns: ['<rootDir>/dist/'],
  roots: [
    '<rootDir>/test',
    '<rootDir>/src'
  ],
  coverageDirectory: './coverage/',
  collectCoverageFrom: [
    'src/**/*.ts',
    '!<rootDir>/src/**/*.interface.ts',
    '!<rootDir>/src/**/*.mock.ts',
    '!<rootDir>/src/**/*.module.ts',
    '!<rootDir>/src/**/*.spec.ts',
    '!<rootDir>/src/**/*.test.ts',
    '!<rootDir>/src/**/*.d.ts',
    '!<rootDir>/src/index.ts'
  ],
};