import test, { expect } from '@playwright/test'

/**
 * サーバーコンポーネントとして利用できるコンポーネント一覧
 */
const SERVER_COMPONENTS = [
  'Text',
  'Table',
  'Loader',
  'Td',
  'RadioButton',
  'Chip',
  'LineClamp',
  'RemoteDialogTrigger',
  'SpreadsheetTable',
  'Balloon',
  'Badge',
  'VisuallyHiddenText',
  'SmartHRLogo',
  'UnstyledButton',
  'RangeSeparator',
  'TableReel',
  'BulkActionRow',
  'Tooltip',
  'Icon',
  'Input',
  'CheckBox',
  'TextLink',
  'Select',
  'Th',
  'StatusLabel',
  'Textarea',
  'CurrencyInput',
  'TabItem',
  'SearchInput',
  'ResponseMessage',
]

/**
 * サーバーコンポーネントでは利用できないコンポーネント一覧
 */
const CLIENT_COMPONENTS = [
  'Button',
  'Dropdown',
  'Stack',
  'Heading',
  'Cluster',
  'Base',
  'Dialog',
  'ActionDialog',
  'DatePicker',
  'AccordionPanel',
  'DefinitionList',
  'Fieldset',
  'FlashMessage',
  'Section',
  'Center',
  'Pagination',
  'Calendar',
  'FormControl',
  'Cell',
  'AppNavi',
  'CompactInformationPanel',
  'PageHeading',
  'InformationPanel',
  'Header',
  'NotificationBar',
  'TabBar',
  'FormGroup',
  'BottomFixedArea',
  'DropdownMenuButton',
  'FloatArea',
  'Row',
  'MultiComboBox',
  'SingleComboBox',
  'BaseColumn',
  'InputFile',
  'EmptyTableBody',
  'Head',
  'ErrorScreen',
  'FilterDropdown',
  'SegmentedControl',
  'MessageDialog',
  'DropZone',
  'Sidebar',
  'RemoteTriggerActionDialog',
  'PageCounter',
  'SideNav',
  'MessageScreen',
  'ModelessDialog',
  'Reel',
  'RadioButtonPanel',
  'Switch',
  'RemoteTriggerFormDialog',
  'FormDialog',
  'TdCheckbox',
  'ThCheckbox',
  'Nav',
  'Article',
  'RemoteTriggerMessageDialog',
  'Aside',
  'AppLauncher',
]

test.describe('RSC対応コンポーネントがRSCで利用できること', () => {
  for (const component of SERVER_COMPONENTS) {
    test(component, async ({ page }) => {
      await page.goto(`http://localhost:3000/rsc_test/${component}`)
      await expect(page.getByText(`Success: ${component}`)).toBeVisible()
      await expect(page.getByText('Server Error')).not.toBeVisible()
    })
  }
})

test.describe('RSC非対応コンポーネントはRSCでエラーになること', () => {
  for (const component of CLIENT_COMPONENTS) {
    test(component, async ({ page }) => {
      await page.goto(`http://localhost:3000/rsc_test/${component}`)
      await expect(page.getByText('Server Error')).toBeVisible()
      await expect(page.getByText(`Success: ${component}`)).not.toBeVisible()
    })
  }
})
