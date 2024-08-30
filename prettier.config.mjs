import styleGuide from '@vercel/style-guide/prettier';

/**
 * @see https://prettier.io/docs/en/configuration.html
 * @type {import("prettier").Config}
 */
const config = {
  ...styleGuide,
  singleQuote: true,
  tabWidth: 2,
  printWidth: 120,
  trailingComma: 'none',
  semi: true,
  plugins: [...styleGuide.plugins, 'prettier-plugin-tailwindcss']
};

export default config;
