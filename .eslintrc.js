module.exports = {
  'env': {
    'browser': true,
    'es2021': true
  },
  'extends': [
    'next',
    'eslint:recommended',
    'plugin:react/recommended',
    'plugin:react-hooks/recommended',
  ],
  'overrides': [],
  'parserOptions': {
    'ecmaVersion': 'latest',
    'sourceType': 'module'
  },
  'plugins': [
    'react',
    'react-hooks'
  ],
  'rules': {
    'quotes': ['error', 'single'],
    'object-curly-spacing': ['error', 'always'],
    'max-len': 'off',
    'react/prop-types': 'off',
    'react/no-unescaped-entities': 'off',
    'no-unused-vars': 'warn',
    'react/jsx-key': 'off',
    'react/react-in-jsx-scope': 'off',
    'no-undef': 'off',
    'no-empty': 'off',
    'react/no-unknown-property': 'off',
    'react/display-name': 'off',
    'no-unsafe-optional-chaining': 'off'
  }
};
