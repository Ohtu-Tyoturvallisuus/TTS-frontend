module.exports = function(api) {
  api.cache(true);
  return {
    presets: ['babel-preset-expo'],
    plugins: [
      [
        'module-resolver',
        {
          root: ['./src/'],
          alias: {
            '@components': './src/components',
            '@contexts': './src/contexts',
            '@hooks': './src/hooks',
            '@lang': './src/lang',
            '@services': './src/services',
            '@utils': './src/utils',
          },
        },
      ],
      'nativewind/babel'
    ],
  };
};
