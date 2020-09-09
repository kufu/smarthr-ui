import { storiesOf } from '@storybook/react'
import { action } from '@storybook/addon-actions'
import * as React from 'react'

import { Header } from './Header'

import readme from './README.md'

const handlers = {
  onClickLogo: action('clicked logo'),
  onClickHelp: action('clicked help'),
  onClickNotification: action('clicked notification'),
  onClickAccount: action('clicked account'),
  onClickLogout: action('clicked logout'),
  onClickCrewList: action('clicked crew list'),
  onClickNewCrew: action('clicked new crew'),
  onClickBulkInsertCrews: action('clicked bulk insert crews'),
  onClickBulkUpdateCrews: action('clicked bulk update crews'),
  onClickInviteCrew: action('clicked invite crew'),
  onClickProfile: action('clicked profile'),
  onClickCompany: action('clicked company'),
  onClickSchool: action('clicked school'),
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
      isCrew={false}
      showLogout={false}
      user={{
        displayName: 'example@example.com',
        avatar: '',
      }}
      currentTenantName="example, Inc."
      notificationLength={999}
      {...handlers}
    />
  ))
  .add('not admin', () => (
    <Header
      isCrew={false}
      user={{
        displayName: 'example@example.com',
        avatar: '',
      }}
      currentTenantName="example, Inc."
      notificationLength={0}
      {...handlers}
    />
  ))
  .add('crew', () => (
    <Header
      isAdmin
      isCrew
      user={{
        displayName: 'example@example.com',
        avatar: 'https://placehold.jp/150x150.png',
      }}
      currentTenantName="example, Inc."
      notificationLength={2}
      {...handlers}
    />
  ))
  .add('not crew', () => (
    <Header
      isAdmin
      isCrew={false}
      user={{
        displayName: 'example@example.com',
        avatar: 'https://placehold.jp/150x150.png',
      }}
      currentTenantName="example, Inc."
      notificationLength={999}
      {...handlers}
    />
  ))
