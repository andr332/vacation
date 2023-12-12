module.exports = {
  arrowParens: 'always',
  singleQuote: true,
  jsxSingleQuote: true,
  tabWidth: 2,
  semi: true,
  printWidth: 120,
  plugins: ['@ianvs/prettier-plugin-sort-imports', 'prettier-plugin-tailwindcss'],
  tailwindConfig: './tailwind.config.js',
  importOrder: [
    '^(react/(.*)$)|^(react$)',
    '^(next/(.*)$)|^(next$)',
    '<THIRD_PARTY_MODULES>',
    '',
    '^types$',
    '^@/types/(.*)$',
    '',
    '^@/data/(.*)$',
    '^@/config/(.*)$',
    '^@/context/(.*)$',
    '^@/store/(.*)$',
    '^@/libs/(.*)$',
    '^@/utils/(.*)$',
    '^@/validations/(.*)$',
    '^@/hooks/(.*)$',
    '',
    '^@/components/ui/(.*)$',
    '',
    '^@/components/(.*)$',
    '^@/registry/(.*)$',
    '',
    '^@/styles/(.*)$',
    '',
    '^@/public/(.*)$',
    '^@/app/(.*)$',
    '',
    '^[./]',
  ],
};
