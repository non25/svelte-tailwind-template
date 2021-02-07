# Best Svelte + TailwindCSS template

Another Svelte + TailwindCSS template, but this time it doesn't suck

## Features

- Bundled with Webpack 5
- `@apply` and friends working in svelte component's style tags, should be called explicitly: `<style lang="postcss">`
- Same in `.pcss` files
- Hot module replacement
- Sane reload times - 700 avg ms for Tailwind in components, 250 avg ms for regular component css. Tested on Ryzen 2500u capped at 2GHz
- Prebuilding of Tailwind's unpurged global css in public to shorten reload times, made by running `npm run predev`
- Skipping Tailwind imports in dev mode to improve reload times
- Importing and purging Tailwind's css in production


## Installation

### NPM

```bash
git clone https://github.com/non25/svelte-tailwind-template my-new-project
# or with degit
npx degit non25/svelte-tailwind-template my-new-project
cd my-new-project
npm install
npm run predev
npm run dev

npm run build
```

### Yarn 2

```bash
git clone https://github.com/non25/svelte-tailwind-template my-new-project
# or with degit
npx degit non25/svelte-tailwind-template my-new-project
cd my-new-project
yarn install
yarn predev
yarn dev

yarn build
```

## Notes

To have bearable reload times and the ability to use utility classes without `@apply`, these should be precompiled using `npm run predev` or `yarn predev`.

```scss
@tailwind base;
@tailwind components;
@tailwind utilities;
```

## Improve this template

Let me know what's missing. This is absolute minimum that should be in any Svelte + TailwindCSS project, but it can be extended with other stuff.

# License

MIT
