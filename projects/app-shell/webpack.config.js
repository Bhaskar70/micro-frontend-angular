const {
  shareAll,
  withModuleFederationPlugin,
} = require('@angular-architects/module-federation/webpack');

module.exports = withModuleFederationPlugin({
  name: 'app-shell',

  remotes: {
    'weather': 'http://localhost:4201/remoteEntry.js',
    'task-board': 'http://localhost:4202/remoteEntry.js',
  },
  
  shared: {
    ...shareAll({ singleton: true, strictVersion: true, requiredVersion: 'auto' }),
  },
});
