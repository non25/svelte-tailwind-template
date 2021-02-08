const postcssImport = require('postcss-import');
const tailwindcss = require('tailwindcss');
const purgecss = require('@fullhuman/postcss-purgecss');
const autoprefixer = require('autoprefixer');
const cssnano = require('cssnano');

const prod = process.env.NODE_ENV === 'production';

const configuredAutoprefixer = autoprefixer({
  // config here
});

module.exports = {
  plugins: [
    tailwindcss,
    postcssImport,
    prod && purgecss({
      content: [
        './src/**/*.js',
        './src/**/*.svelte',
      ],
    }),
    configuredAutoprefixer,
    prod && cssnano,
  ].filter(Boolean),
  pluginsLight: [postcssImport, configuredAutoprefixer]
};
