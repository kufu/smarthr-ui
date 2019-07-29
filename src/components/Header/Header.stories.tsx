import { storiesOf } from '@storybook/react'
import * as React from 'react'
import { Header } from './Header'

storiesOf('Header', module).add('all', () => <Header tenant_name="TESTINC 株式会社" />)
