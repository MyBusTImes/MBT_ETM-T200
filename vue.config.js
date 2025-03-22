const { defineConfig } = require('@vue/cli-service');

module.exports = defineConfig({
  pwa: {
    name: 'MyTicketer',
    themeColor: '#FFFFFF',
    msTileColor: '#FFFFFF',
    manifestOptions: {
      background_color: '#FFFFFF',
    },
    workboxOptions: {
      cacheName: 'my-ticket-v2.0.31',
      // You can define custom cache names here
      skipWaiting: true, // Skip waiting to activate the new service worker immediately
      clientsClaim: true, // Ensure the service worker controls all clients as soon as possible
      runtimeCaching: [
        {
          urlPattern: /\.css$/,
          handler: 'StaleWhileRevalidate',
          options: {
            cacheName: 'styles-cache',
          },
        },
        {
          urlPattern: /\.(?:js|json)$/,
          handler: 'CacheFirst',
          options: {
            cacheName: 'scripts-cache',
          },
        },
      ],
    },
  },
  chainWebpack: (config) => {
    // Ensure the HTML plugin is available and modify it correctly
    config.plugin('html').tap((args) => {
      // If 'scripts' doesn't exist, initialize it as an array
      if (!args[0].scripts) {
        args[0].scripts = [];
      }
      
      // Add the Font Awesome script to the 'scripts' array
      args[0].scripts.push('https://kit.fontawesome.com/7e32e49cf3.js');
      
      return args;
    });
  },
  devServer: {
    https: false,
    allowedHosts: [
      'ticketer.mybustimes.cc', 
      'dev-ticketer.mybustimes.cc',
      'localhost',
      '192.168.1.150',
    ],
    client: {
      overlay: false, // Disable the error overlay in the browser
    },
  },
});
