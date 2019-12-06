import { storiesOf } from '@storybook/react'
import * as React from 'react'
import { Header } from './Header'
import styled from 'styled-components'

import readme from './README.md'

const notification = {
  url: 'abc',
  number: 999,
}
const employeeDropDown = {
  crewsNewUrl: 'path/to/crewsNewUrl/',
  crewsBulkInserterUrl: 'path/to/crewsBulkInserterUrl/',
  crewsBulkUpdaterUrl: 'path/to/crewsBulkUpdaterUrl/',
  crewsInviterUrl: 'path/to/crewsInviterUrl/',
}
const userDropDown = {
  displayName: 'example@example.com',
  currentTenant: 'example, Inc.',
  avatar: 'path/to/avatarImage',
  profileUrl: 'path/to/profileUrl/',
  myAccountUrl: 'path/to/myAccountUrl/',
  adminCompanyUrl: 'path/to/adminCompanyUrl/',
  schoolUrl: 'path/to/schoolUrl/',
}

storiesOf('Header', module)
  .addParameters({
    readme: {
      sidebar: readme,
    },
  })
  .add('all', () => (
    <Ul>
      <li>
        For admin user
        <Header
          employeeListLink="/crews"
          notification={notification}
          employeeDropDown={employeeDropDown}
          userDropDown={userDropDown}
          isAdmin={true}
          helpUrl="path/to/helpUrl/"
        />
      </li>
      <li>
        For normal user
        <Header
          employeeListLink="/crews"
          notification={notification}
          employeeDropDown={employeeDropDown}
          userDropDown={userDropDown}
          isAdmin={false}
          helpUrl="path/to/helpUrl/"
        />
      </li>
    </Ul>
  ))

const Ul = styled.ul`
  padding: 0;
  list-style: none;

  > li ~ li {
    margin-top: 2rem;
  }
`
