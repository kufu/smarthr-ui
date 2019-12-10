import { storiesOf } from '@storybook/react'
import { action } from '@storybook/addon-actions'
import * as React from 'react'

import { Header } from './Header'

import readme from './README.md'

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
  .add('admin', () => (
    <Header
      isAdmin
      currentTenantName="example, Inc."
      notificationLength={999}
      onClickLogo={action('clicked logo')}
      onClickHelp={action('clicked help')}
      onClickNotification={action('clicked notification')}
      // hoge
      onClickCrewList={action('clicked crew list')}
      onClickNewCrew={action('clicked new crew')}
      onClickBulkInsertCrews={action('clicked bulk insert crews')}
      onClickBulkUpdateCrews={action('clicked bulk update crews')}
      onClickInviteCrew={action('clicked invite crew')}
      //hoge
      userDropDown={userDropDown}
    />
  ))
// .add('all', () => (
//   <Ul>
//     <li>
//       For admin user
//       <Header
//         employeeListLink="/crews"
//         notification={notification}
//         employeeDropDown={employeeDropDown}
//         userDropDown={userDropDown}
//         isAdmin={true}
//         helpUrl="path/to/helpUrl/"
//       />
//     </li>
//     <li>
//       For normal user
//       <Header
//         employeeListLink="/crews"
//         notification={notification}
//         employeeDropDown={employeeDropDown}
//         userDropDown={userDropDown}
//         isAdmin={false}
//         helpUrl="path/to/helpUrl/"
//       />
//     </li>
//   </Ul>
// ))
