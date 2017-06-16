const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');

const config = {
  entry: './src/index.ts',
  output: {
    path: path.resolve(__dirname, 'public'),
    filename: 'index.js'
  },
  module: {
    rules: [
      { test: /\.css$/, use: 'css-loader' },
      { test: /\.ts$/, use: 'awesome-typescript-loader' },
      { enforce: "pre", test: /\.js$/, loader: "source-map-loader" },
      { enforce: 'pre', test: /\.ts$/, loader: 'tslint-loader' }
    ]
  },
  resolve: {
    extensions: [".ts", ".js", ".json"]
  },
  plugins: [
    new HtmlWebpackPlugin({
      template: 'src/index.html'
    })
  ]
};

module.exports = config;