module.exports = {
  root: true,
  env: {
    node: true,
  },
  extends: [
    'plugin:vue/recommended',
    '@vue/airbnb',
  ],
  rules: {
    'no-console': process.env.NODE_ENV === 'production' ? 'error' : 'off',
    'no-debugger': process.env.NODE_ENV === 'production' ? 'error' : 'off',
	'indent': ['error', 'tab'],
	'no-tabs': 'off',
	'vue/html-indent': ['error', 'tab']
  },
  parserOptions: {
    parser: 'babel-eslint',
  },
};
