module.exports = {
    root: true,
    env: {
        node: true
    },
    'extends': [
        'plugin:vue/essential',
        'eslint:recommended'
    ],
    parserOptions: {
        parser: '@babel/eslint-parser'
    },
    rules: {
        quotes: ['error', 'single'],
        semi: ['error', 'always'],
        indent: ['error', 4],
        'vue/html-indent': ['error', 4],
        'max-len': [
            'error',
            { code: 120, tabWidth: 4, ignoreComments: true, ignoreUrls: true },
        ],
        'vue/multi-word-component-names': 'off',
        'comma-dangle': 'off',
        'space-before-function-paren': 'off',
        'arrow-parens': 'off'
    }
};
