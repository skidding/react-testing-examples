let inlineImportOpts = {
  extensions: ['.png', '.svg']
};

module.exports = {
  presets: ['next/babel', '@babel/preset-flow'],
  plugins: [['babel-plugin-inline-import-data-uri', inlineImportOpts]],
  env: {
    test: {
      // Jest runs in Node and needs CommonJS modules. So does SSR, but Next
      // runs webpack on the server as well nowadays
      presets: [['next/babel', { 'preset-env': { modules: 'commonjs' } }]]
    }
  }
};
