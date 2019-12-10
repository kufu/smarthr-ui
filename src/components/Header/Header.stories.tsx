import { storiesOf } from '@storybook/react'
import { action } from '@storybook/addon-actions'
import * as React from 'react'

import { Header } from './Header'

import readme from './README.md'

storiesOf('Header', module)
  .addParameters({
    readme: {
      sidebar: readme,
    },
  })
  .add('admin', () => (
    <Header
      isAdmin
      user={{
        displayName: 'example@example.com',
        avatar: '',
      }}
      currentTenantName="example, Inc."
      notificationLength={999}
      onClickLogo={action('clicked logo')}
      onClickHelp={action('clicked help')}
      onClickNotification={action('clicked notification')}
      onClickAccount={action('clicked account')}
      onClickLogout={action('clicked logout')}
      onClickCrewList={action('clicked crew list')}
      onClickNewCrew={action('clicked new crew')}
      onClickBulkInsertCrews={action('clicked bulk insert crews')}
      onClickBulkUpdateCrews={action('clicked bulk update crews')}
      onClickInviteCrew={action('clicked invite crew')}
      onClickProfile={action('clicked profile')}
      onClickCompany={action('clicked company')}
      onClickSchool={action('clicked school')}
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
