module.exports = {
  projects: [
    {
      displayName: 'backend',
      testEnvironment: 'node',
      rootDir: 'backend',
      testMatch: ['**/__tests__/**/*.js', '**/?(*.)+(spec|test).js'],
      collectCoverageFrom: [
        '**/*.js',
        '!node_modules/**',
        '!coverage/**',
        '!Dockerfile',
        '!index.js'
      ],
      coverageDirectory: '../coverage/backend',
      coverageThreshold: {
        global: {
          branches: 50,
          functions: 50,
          lines: 50,
          statements: 50
        }
      }
    },
    {
      displayName: 'frontend',
      testEnvironment: 'jsdom',
      rootDir: 'frontend',
      testMatch: ['**/__tests__/**/*.js', '**/?(*.)+(spec|test).js'],
      collectCoverageFrom: [
        'src/**/*.js',
        '!src/index.js',
        '!src/reportWebVitals.js'
      ],
      coverageDirectory: '../coverage/frontend',
      coverageThreshold: {
        global: {
          branches: 50,
          functions: 50,
          lines: 50,
          statements: 50
        }
      }
    }
  ]
};
