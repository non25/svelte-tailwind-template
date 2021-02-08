const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const PostCSSAssetsPlugin = require('postcss-assets-webpack-plugin');
const sveltePreprocess = require('svelte-preprocess');
const path = require('path');

const postcss = require('postcss');
const postcssConfig = require('./postcss.config.js');
const { pluginsLight } = postcssConfig;
const postcssImport = require('postcss-import')

const mode = process.env.NODE_ENV || 'development';
const prod = mode === 'production';

module.exports = {
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
                // inline imports in any style tag
                defaults: { style: 'style' },
                style({ content, filename }) {
                  return postcss(prod ? [postcssImport] : pluginsLight)
                    .process(content, { from: filename })
                    .then(({ css: code, map }) => ({ code, map }));
                },

                // batch postcss stuff in production mode, but inline imports
                // before they hit emitCss stage where they won't work properly
                postcss({ content, filename }) {
                  return postcss(prod ? [postcssImport] : postcssConfig.plugins)
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
        // just load svelte component css without processing, it's already
        // autoprefixed and has its imports inlined through svelte-preprocess
        include: /svelte.\d+.css/,
        use: [
          MiniCssExtractPlugin.loader,
          'css-loader'
        ]
      },
      {
        test: /\.css$/,
        exclude: /svelte.\d+.css/,
        use: [
          MiniCssExtractPlugin.loader,
          {
            // for other css files, process with autoprefixer and inline
            // imports, but leave autoprefixer for batch mode in production
            loader: 'postcss-loader',
            options: {
              postcssOptions: { plugins: prod ? [postcssImport] : pluginsLight }
            }
          },
          'css-loader'
        ]
      },
      {
        test: /\.pcss$/,
        // skip tailwind's css in devmode to improve reload times
        include: !prod ? /tailwind.pcss/ : /you-shouldn't-match-me-or-else/,
        use: 'null-loader'
      },
      {
        test: /\.pcss$/,
        exclude: !prod ? /tailwind.pcss/ : /you-shouldn't-match-me-or-else/,
        use: [
          MiniCssExtractPlugin.loader,
          'css-loader',
          'postcss-loader'
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
    }),
    // batch css processing in production
    ...(prod ? [new PostCSSAssetsPlugin({ plugins: postcssConfig })] : [])
  ],
  devtool: prod ? false : 'source-map',
  devServer: {
    hot: true,
    contentBase: 'public',
    host: '0.0.0.0'
  }
};
