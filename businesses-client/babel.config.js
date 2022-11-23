module.exports = function (api) {
  api.cache(true)
  return {
    presets: ['babel-preset-expo'],
    plugins: [
      [
        'module:react-native-dotenv',
        {
          envName: 'APP_ENV',
          moduleName: '@env',
          path: '.env',
          blocklist: null,
          allowlist: null,
          safe: false,
          allowUndefined: true,
          verbose: false,
        },
      ],
      [
        'module-resolver',
        {
          root: ['.'],
          extensions: [
            '.ios.ts',
            '.android.ts',
            '.ts',
            '.ios.tsx',
            '.android.tsx',
            '.tsx',
            '.jsx',
            '.js',
            '.json',
          ],
          alias: {
            root: './src',
            screens: './src/screens',
            components: './src/components',
            store: './src/store',
            constants: './src/constants',
            contexts: './src/contexts',
            lib: './src/lib',
            api: './src/api',
            utils: './src/utils',
          },
        },
      ],
      'react-native-reanimated/plugin',
    ],
  }
}
