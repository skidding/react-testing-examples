// @flow

import React from 'react';
import { App } from '../components/App';
import { setup, tests } from '../import-files';

// TODO: Find a better place for this if there will be more than one page
import '../global';

// TODO: Read commit SHA (or point to master)
export default () => (
  <App
    commitSha="24c2bd39be7cb2a5e17a671e5535525e364f8aaa"
    setup={setup}
    tests={tests}
  />
);