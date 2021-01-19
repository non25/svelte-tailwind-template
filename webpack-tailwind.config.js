const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const tailwindConfig = require('./tailwind.config.js');
const path = require('path');

tailwindConfig.purge.enabled = false;

module.exports = {
  entry: {
    'tailwind': './src/tailwind.tcss'
  },
  output: {
    path: __dirname + '/public',
    filename: '[name].js',
  },
  module: {
    rules: [
      {
        test: /\.tcss$/,
        use: [
          MiniCssExtractPlugin.loader,
          'css-loader',
          {
            loader: 'postcss-loader',
            options: {
              postcssOptions: {
                plugins: [ require('tailwindcss')(tailwindConfig) ]
              }
            }
          }
        ]
      },
    ]
  },
  plugins: [
    new MiniCssExtractPlugin({
      filename: '[name].css'
    })
  ],
};
