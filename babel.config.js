module.exports = {
  presets: ['module:@react-native/babel-preset'],
  env: {
    production: {
      plugins: [
        [
          'transform-remove-console',
          {
            exclude: ['error', 'warn'],
          },
        ],
      ],
    },
  },
  plugins: [
    [
      'module-resolver',
      {
        alias: {
          '@rvmob': './src',
          '@rvmob-i18n': './i18n',
        },
      },
    ],
    'react-native-reanimated/plugin',
  ],
};
