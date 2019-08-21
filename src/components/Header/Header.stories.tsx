import { storiesOf } from '@storybook/react'
import * as React from 'react'
import { Header } from './Header'
import styled from 'styled-components'

const notification = {
  url: 'abc',
  number: 999,
}
const headerEmployeeDropDown = {
  crewsNewUrl: 'path/to/crewsNewUrl/',
  crewsBulkInserterUrl: 'path/to/crewsBulkInserterUrl/',
  crewsBulkUpdaterUrl: 'path/to/crewsBulkUpdaterUrl/',
  crewsInviterUrl: 'path/to/crewsInviterUrl/',
}
const headerUserDropDown = {
  displayName: 'example@example.com',
  currentTenant: 'example, Inc.',
  avatar: 'path/to/avatarImage',
  profileUrl: 'path/to/profileUrl/',
  myAccountUrl: 'path/to/myAccountUrl/',
  adminCompanyUrl: 'path/to/adminCompanyUrl/',
  helpUrl: 'path/to/helpUrl/',
  schoolUrl: 'path/to/schoolUrl/',
}

storiesOf('Header', module).add('all', () => (
  <Ul>
    <li>
      For admin user
      <Header
        employeeListButtonLink="/crews"
        headerNotification={notification}
        headerEmployeeDropDown={headerEmployeeDropDown}
        headerUserDropDown={headerUserDropDown}
        isAdmin={true}
      />
    </li>
    <li>
      For normal user
      <Header
        employeeListButtonLink="/crews"
        headerNotification={notification}
        headerEmployeeDropDown={headerEmployeeDropDown}
        headerUserDropDown={headerUserDropDown}
        isAdmin={false}
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
