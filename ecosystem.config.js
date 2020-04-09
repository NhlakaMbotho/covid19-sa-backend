module.exports = {
  apps: {
    name: 'covid',
    script: 'app.js',
    instances: 1,
    autorestart: true,
    watch: true,
    max_memory_restart: '1G',
    env: {
      NODE_ENV: 'development',
      PRIVATE_KEY: 'devPrivateKey',
      PORT: 3000
    },
    env_production: {
      NODE_ENV: 'production'
    }
  }
};
