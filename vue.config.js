const { defineConfig } = require('@vue/cli-service');

module.exports = {
  devServer: {
    allowedHosts: [
      'ticketer.mybustimes.cc', // Add your domain or IP here
      'localhost',
      '192.168.1.150' // Include localhost if needed
    ],
    // Other devServer options (e.g., host, port, etc.)
  },
};