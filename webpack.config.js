const path = require('path');
// const webpack = require('webpack');
const nodeExternals = require('webpack-node-externals');

module.exports = {
  entry: './src/server.js',  // Your entry point file
  output: {
    path: path.resolve(__dirname, 'dist'),
    filename: 'bundle.js',
  },
  target: 'node',  // Specify that the target is Node.js
  mode: 'production',  // Set mode to production for optimizations
//   plugins: [
//     new webpack.ContextReplacementPlugin(
//       /mongoose[\/\\]lib/, 
//       path.resolve(__dirname, './src')
//     ),
//   ],
  externals: [nodeExternals()],
  module: {
    rules: [
      {
        test: /\.js$/,
        exclude: /node_modules/,
        use: {
          loader: 'babel-loader',
          options: {
            presets: ['@babel/preset-env'],
          },
        },
      },
    ],
  },
  resolve: {
    fallback: {
      fs: false,       // Ignore fs module
      path: false,     // Ignore path module
      crypto: false,   // Ignore crypto module
      buffer: false,   // Ignore buffer module
      util: false,     // Ignore util module
    },
  },
};