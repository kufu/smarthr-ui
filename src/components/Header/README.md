# Header

```tsx
import { Header } from 'smarthr-ui'

<Header
  logoUrl="path/to/root/"
  employeeListLink="/crews"
  notification={notification}
  employeeDropDown={employeeDropDown}
  userDropDown={userDropDown}
  isAdmin={true}
  helpUrl="path/to/helpUrl/"
/>
```

## props

| Name             | Required | Type        | DefaultValue | Description                                    |
| ---------------- | -------- | ----------- | ------------ | ---------------------------------------------- |
| logoUrl          | -        | **string**  | '/'          | The URL to link to when the button is clicked. |
| employeeListLink | ✓        | **string**  | -            | The URL to employee list page.                 |
| notification     | ✓        | **object**  | -            | Object that includes data of notification.     |
| employeeDropDown | -        | **object**  | -            | Object that includes data of employeeDropDown. |
| userDropDown     | -        | **object**  | -            | Object that includes data of userDropDown.     |
| isAdmin          | -        | **boolean** | false        | If true. display some menues for admin.        |
| helpUrl          | ✓        | **string**  | -            | The URL to help page.                          |

### Data structure

#### notification

| Name   | Required | Type       | DefaultValue     | Description                                       |
| ------ | -------- | ---------- | ---------------- | ------------------------------------------------- |
| number | -        | **number** | 0                | Number of notifications.                          |
| url    | -        | **string** | '/notifications' | The URL to link to when the notification clicked. |

#### employeeDropDown

| Name                 | Required | Type       | DefaultValue | Description                                                     |
| -------------------- | -------- | ---------- | ------------ | --------------------------------------------------------------- |
| crewsNewUrl          | ✓        | **string** | -            | The URL to link to when the `新規登録する（手入力）` clicked.   |
| crewsBulkInserterUrl | ✓        | **string** | -            | The URL to link to when the `新規登録する（ファイル）` clicked. |
| crewsBulkUpdaterUrl  | ✓        | **string** | -            | The URL to link to when the `更新する（ファイル）` clicked.     |
| crewsBulkUpdaterUrl  | ✓        | **string** | -            | The URL to link to when the `SmartHR に招待` clicked.           |

#### userDropDown

| Name            | Required | Type       | DefaultValue | Description                    |
| --------------- | -------- | ---------- | ------------ | ------------------------------ |
| displayName     | ✓        | **string** | -            | Displayed name.                |
| currentTenant   | ✓        | **string** | -            | Displayed current tenant name. |
| avatar          | -        | **string** | -            | Path to avatar.                |
| profileUrl      | ✓        | **string** | -            | The URL to profile page.       |
| myAccountUrl    | ✓        | **string** | -            | The URL to my account page.    |
| adminCompanyUrl | ✓        | **string** | -            | The URL to admin company page. |
| schoolUrl       | ✓        | **string** | -            | The URL to school page.        |
