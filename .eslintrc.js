module.exports = {
  parser: '@typescript-eslint/parser',
  parserOptions: {
    project: 'tsconfig.json',
    sourceType: 'module',
  },
  plugins: ['@typescript-eslint/eslint-plugin'],
  extends: [
    'plugin:@typescript-eslint/eslint-recommended',
    'plugin:@typescript-eslint/recommended',
    'prettier',
    'prettier/@typescript-eslint',
  ],
  root: true,
  env: {
    node: true,
    jest: true,
  },
  rules: {
    'semi': [
      'error',
      'always'
    ],
    'quotes': [
      'error',
      'single',
      {
        'allowTemplateLiterals': true
      }
    ],
    'no-undef': 'error',
    'eol-last': [
      'error',
      'always'
    ],
    'template-tag-spacing': [
      'error',
      'always'
    ],
    'no-multi-spaces': 'error',
    'key-spacing': [
      'error',
      {
        'mode': 'strict',
        'beforeColon': false
      }
    ],
    'space-in-parens': [
      'error',
      'never'
    ],
    'array-element-newline': [
      'error',
      'consistent'
    ],
    'max-len': [
      'error',
      {
        'code': 120,
        'ignoreComments': true
      }
    ],
    'no-regex-spaces': 'error',
    'padding-line-between-statements': [
      'error'
      // { 'blankLine': 'always', 'prev:': ['const', 'let', 'var'], 'next': '*'},
      // { 'blankLine': 'any',    'prev': ['const', 'let', 'var'], 'next': ['const', 'let', 'var']}
    ],
    'newline-before-return': 'error',
    'complexity': [
      'error',
      100
    ],
    'eqeqeq': [
      'error',
      'always'
    ],
    'default-case': 'error',
    'no-empty-function': 'off',
    'no-case-declarations': 'off',
    'init-declarations': [
      'off',
      'always'
    ],
    'spaced-comment': [
      'error',
      'always'
    ],
    'function-call-argument-newline': [
      'error',
      'never'
    ],
    'jsx-quotes': [
      'error',
      'prefer-double'
    ],
    'lines-between-class-members': [
      'error',
      'always'
    ],
    'lines-around-comment': [
      'error',
      {
        'beforeBlockComment': true,
        'allowBlockStart': true
      }
    ],
    'no-multiple-empty-lines': [
      'error',
      {
        'max': 1
      }
    ],
    'no-trailing-spaces': 'error',
    // 'operator-linebreak': ['error', 'none'],
    'block-spacing': [
      'error',
      'always'
    ],
    'camelcase': 'error',
    'no-lonely-if': 'error',
    'no-mixed-spaces-and-tabs': 'error',
    'no-multi-assign': 'error',
    'padded-blocks': [
      'error',
      'never'
    ],
    'no-empty': 'error',
    'arrow-body-style': [
      'error',
      'as-needed'
    ],
    'curly': 'error',
    'brace-style': 'error',
    'comma-dangle': [
      'error',
      {
        'objects': 'always-multiline'
      }
    ],
    'prefer-const': 'error',
    'no-whitespace-before-property': 'error',
    'space-infix-ops': [
      'error'
    ],
    'no-duplicate-imports': 'error',
    'no-dupe-keys': 'error',
    'no-dupe-args': 'error',
    'object-curly-spacing': [
      'error',
      'always'
    ],
    '@typescript-eslint/interface-name-prefix': 'off',
    '@typescript-eslint/explicit-function-return-type': 'off',
    '@typescript-eslint/no-explicit-any': 'off',
    '@typescript-eslint/explicit-module-boundary-types': 'off',
  },
};
