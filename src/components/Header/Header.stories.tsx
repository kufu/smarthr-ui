import { storiesOf } from '@storybook/react'
import * as React from 'react'
import { Header } from './Header'

storiesOf('Header', module).add('all', () => (
  <Header
    employeeListButtonLink="/crews"
    notificationNumber={100}
    crewsNewUrl="abc"
    crewsBulkInserterUrl="abc"
    crewsBulkUpdaterUrl="abc"
    crewsInviterUrl="abc"
    displayName="abc@example.com"
    currentTenant="Text Inc."
    profileUrl="abc"
    myAccountUrl="abc"
    adminCompanyUrl="abc"
    helpUrl="abc"
    schoolUrl="abc"
    isAdmin={true}
  />
))
