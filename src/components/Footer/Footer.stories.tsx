import React from 'react'
import { storiesOf } from '@storybook/react'
import readme from './README.md'

import { Footer } from './Footer'

storiesOf('Footer', module)
  .addParameters({
    readme: {
      sidebar: readme,
    },
  })
  .add('all', () => <Footer />)
