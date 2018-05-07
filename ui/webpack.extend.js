// Warning: These function mutates the config like a mf
module.exports = function(config, babelLoader) {
  config.module.rules.push(
    {
      test: /(README|SETUP|WHATSTHIS).md$/,
      use: [babelLoader, '@mdx-js/loader']
    },
    {
      test: require.resolve('./import-files'),
      use: require.resolve('./webpack-loaders/import-tests-loader')
    }
  );

  return config;
};