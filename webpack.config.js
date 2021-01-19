const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const sveltePreprocess = require('svelte-preprocess');
const postcss = require('postcss');
const autoprefixer = require('autoprefixer');
const tailwindcss = require('tailwindcss')('./tailwind.config.js');
const path = require('path');

const postCSSPlugins = [
  autoprefixer()
];

module.exports = ({ production: prod }) => ({
  entry: {
    'bundle': './src/main.js'
  },
  resolve: {
    alias: {
      svelte: path.dirname(require.resolve('svelte/package.json'))
    },
    extensions: ['.mjs', '.js', '.svelte'],
    mainFields: ['svelte', 'browser', 'module', 'main']
  },
  output: {
    path: __dirname + '/public',
    filename: '[name].js',
    chunkFilename: '[name].[id].js'
  },
  module: {
    rules: [
      {
        test: /\.svelte$/,
        use: [
          {
            loader: 'svelte-loader',
            options: {
              compilerOptions: {
                dev: !prod,
              },
              emitCss: prod,
              hotReload: !prod,
              preprocess: sveltePreprocess({
                postcss({ content, filename, attributes }) {
                  // if lang is tailwind, then skip postcss default config
                  // for this style tag and just return it as is
                  // postcss is launched for any style tag by default in
                  // svelte-preprocess to make :global work
                  return attributes.lang === 'tailwind'
                    ? { code: content }
                    : postcss(postCSSPlugins)
                    .process(content, { from: filename })
                    .then(({ css: code, map }) => ({ code, map }));
                },
                tailwind({ content, filename }) {
                  // apply tailwind's transformation and then other postcss
                  // transformations like autoprefixer for lang="tailwind" in
                  // one batch
                  // this is more efficient than parsing css twice
                  return postcss([ tailwindcss, ...postCSSPlugins ])
                    .process(content, { from: filename })
                    .then(({ css: code, map }) => ({ code, map }));
                }
              })
            }
          }
        ]
      },
      {
        test: /\.css$/,
        use: [
          prod ? MiniCssExtractPlugin.loader : 'style-loader',
          'css-loader'
        ]
      },
      {
        test: /\.tcss$/,
        // skip tailwind's css in devmode to improve reload times
        include: !prod ? /tailwind.tcss/ : /you-shouldn't-match-me-or-else/,
        use: 'null-loader'
      },
      {
        // tailwindcss files that support @apply and friends should be separated
        // from regular css, because generating tailwind's AST is expensive
        test: /\.tcss$/,
        use: [
          prod ? MiniCssExtractPlugin.loader : 'style-loader',
          'css-loader',
          {
            loader: 'postcss-loader',
            options: {
              postcssOptions: {
                plugins: [ tailwindcss, ...postCSSPlugins ]
              }
            }
          }
        ]
      },
      {
        // required to prevent errors from Svelte on Webpack 5+
        test: /svelte\/.*\.mjs$/,
        resolve: {
          fullySpecified: false
        }
      }
    ]
  },
  mode: prod ? 'production' : 'development',
  plugins: [
    new MiniCssExtractPlugin({
      filename: '[name].css'
    })
  ],
  devtool: prod ? false : 'source-map',
  devServer: {
    hot: true,
    host: '0.0.0.0'
  }
});
