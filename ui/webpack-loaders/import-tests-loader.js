const { existsSync } = require('fs');
const { join } = require('path');
const glob = require('glob');

module.exports = function parseReadme(source) {
  let tests = getTestDirs()
    .map(getTestObj)
    .join(',');

  // TODO: Retrieve last commit sha https://stackoverflow.com/a/14135272/128816
  let gitRef = 'master';

  return source
    .replace('tests = []', `tests = [${tests}]`)
    .replace(`gitRef = ''`, `gitRef = '${gitRef}'`);
};

function getTestDirs() {
  // Hmm, maybe put tests in a dedicate dir...
  return glob.sync('./[0-9]*/').map(p => p.replace(/^\.\/(.+)\/$/, '$1'));
}

function getTestObj(name) {
  let readmeTextLoader = getLoaderPath('readme-text-loader');

  return `{
    name: '${name}',
    readme: {
      text: require('!${readmeTextLoader}!${getFilePath(name, '/README.md')}'),
      markup: require('${getFilePath(name, '/README.md')}').default
    },
    code: {
      components: require('!raw-loader!${getFilePath(name, '/components')}'),
      enzyme: {
        test: require('!raw-loader!${getFilePath(name, '/enzyme.test')}')
      },
      cosmos: {
        test: require('!raw-loader!${getFilePath(name, '/cosmos.test')}'),
        fixture: require('!raw-loader!${getFilePath(name, '/fixture')}'),
        proxies: ${getProxiesReq(name)}
      }
    }
  }`;
}

function getProxiesReq(testName) {
  let proxiesPath = getFilePath(testName, 'cosmos.proxies.js');

  return existsSync(proxiesPath)
    ? `require('!raw-loader!${proxiesPath}')`
    : 'undefined';
}

function getFilePath(testName, filePath) {
  return join(__dirname, `../../${testName}/${filePath}`);
}

function getLoaderPath(filePath) {
  return join(__dirname, `../webpack-loaders/${filePath}`);
}
