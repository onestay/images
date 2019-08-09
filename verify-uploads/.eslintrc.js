module.exports = {
    extends: [
        'eslint-config-airbnb'
    ],
    rules: {
        'no-console': process.env.NODE_ENV === 'production' ? 'error' : 'off',
        'no-debugger': process.env.NODE_ENV === 'production' ? 'error' : 'off',
        'indent': ['error', 'tab'],
        'no-tabs': 'off',
    }
}