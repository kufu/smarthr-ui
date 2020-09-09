# Header

```tsx
import { Header } from 'smarthr-ui'
```

```tsx
<Header
  isAdmin
  isCrew
  user={{
    displayName: 'example@example.com',
    avatar: 'https://placehold.jp/150x150.png',
  }}
  currentTenantName="example, Inc."
  tenantContent={<div>example, Inc.</div>}
  notificationLength={999}
  onClickLogo={handleClickLogo}
  onClickHelp={handleClickHelp}
  onClickNotification={handleClickNotification}
  onClickAccount={handleClickAccount}
  onClickLogout={handleClickLogout}
  onClickCrewList={handleClickCrewList}
  onClickNewCrew={handleClickNewCrew}
  onClickBulkInsertCrews={handleClickBulkInsertCrews}
  onClickBulkUpdateCrews={handleClickBulkUpdateCrews}
  onClickInviteCrew={handleClickInviteCrew}
  onClickProfile={handleClickProfile}
  onClickCompany={handleClickCompany}
  onClickSchool={handleClickSchool}
/>
```

## props

**Header**

| Name                   | Required | Type                                            | DefaultValue | Description                                 |
| ---------------------- | -------- | ----------------------------------------------- | ------------ | ------------------------------------------- |
| isAdmin                | -        | **boolean**                                     | false        | Whether viewer is admin.                    |
| isCrew                 | -        | **boolean**                                     | false        | Whether viewer is crew.                     |
| showHelp               | -        | **boolean**                                     | true         | Show help button.                           |
| showCrewList           | -        | **boolean**                                     | true         | Show crew list button.                      |
| showCrewManagement     | -        | **boolean**                                     | true         | Show crew management dropdown.              |
| showNotification       | -        | **boolean**                                     | true         | Show notification counter.                  |
| showLogout             | -        | **boolean**                                     | true         | Show logout button in user dropdown.        |
| user                   | ✓        | **{ displayName: string,<br> avatar: string }** | -            | Viewer's user information.                  |
| currentTenantName      | ✓        | **string**                                      | -            | Current tenant name.                        |
| tenantContent          | -        | **node**                                        | -            | The content of tenant name area.            |
| notificationLength     | ✓        | **number**                                      | -            | Number of notifications.                    |
| onClickLogo            | ✓        | **() => void**                                  | -            | Fires when the logo clicked.                |
| onClickHelp            | ✓        | **() => void**                                  | -            | Fires when the help clicked.                |
| onClickNotification    | ✓        | **() => void**                                  | -            | Fires when the notifications clicked.       |
| onClickAccount         | ✓        | **() => void**                                  | -            | Fires when the account clicked.             |
| onClickLogout          | ✓        | **() => void**                                  | -            | Fires when the logout clicked.              |
| onClickCrewList        | -        | **() => void**                                  | -            | Fires when the [crew list] clicked.         |
| onClickNewCrew         | -        | **() => void**                                  | -            | Fires when the [new crew] clicked.          |
| onClickBulkInsertCrews | -        | **() => void**                                  | -            | Fires when the [bulk insert crews] clicked. |
| onClickBulkUpdateCrews | -        | **() => void**                                  | -            | Fires when the [bulk update crews] clicked. |
| onClickInviteCrew      | -        | **() => void**                                  | -            | Fires when the [invite crew] clicked.       |
| onClickProfile         | -        | **() => void**                                  | -            | Fires when the profile clicked.             |
| onClickCompany         | -        | **() => void**                                  | -            | Fires when the company clicked.             |
| onClickSchool          | -        | **() => void**                                  | -            | Fires when the school clicked.              |
