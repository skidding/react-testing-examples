// @flow

import { Section } from '.';
import { tests } from '../../import-files';
import { createFixture } from 'react-cosmos';

export default createFixture({
  name: 'Redux test',
  component: Section,
  props: {
    section: {
      type: 'test',
      test: tests[4]
    },
    testFilter: 'cosmos',
    searchText: 'Redux'
  }
});
