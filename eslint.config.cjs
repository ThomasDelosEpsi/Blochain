/** ESLint v9 flat config (CJS) compatible with Node.js CommonJS projects */
const js = require('@eslint/js');
const globals = require('globals');

module.exports = [
  js.configs.recommended,
  {
    files: ['**/*.js'],
    ignores: ['node_modules/**', 'build/**', 'coverage/**'],
    languageOptions: {
      ecmaVersion: 2022,
      sourceType: 'commonjs',
      globals: { ...globals.node, ...globals.mocha }
    },
    rules: {
      // ajoute tes règles ici si besoin
      //aat
    }
  }
];
