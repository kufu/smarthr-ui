import test, { expect } from '@playwright/test'

/**
 * サーバーコンポーネントとして利用できるコンポーネント一覧(アルファベット順)
 */
const SERVER_COMPONENTS = [
  'AnchorButton',
  'AppNaviAnchor',
  'AppNaviButton',
  'AppNaviCustomTag',
  'Badge',
  'Balloon',
  'BaseColumn',
  'Chip',
  'DefinitionList',
  'DefinitionListItem',
  'DatetimeLocalPicker',
  'ErrorScreen',
  'FloatArea',
  'HeaderLink',
  'Icon',
  'Loader',
  'MessageScreen',
  'MonthPicker',
  'NotificationBar',
  'PageCounter',
  'Pagination',
  'RangeSeparator',
  'ResponseMessage',
  'SideNav',
  'SmartHRLogo',
  'SpreadsheetTable',
  'SpreadsheetTableCorner',
  'StatusLabel',
  'Stepper',
  'Switch',
  'TabBar',
  'Table',
  'Td',
  'TdCheckbox',
  'Text',
  'TextLink',
  'Th',
  'ThCheckbox',
  'TimePicker',
  'UnstyledButton',
  'UpwardLink',
  'VisuallyHiddenText',
  'WakuWakuButton',
]

/**
 * サーバーコンポーネント内で、クライアントコンポーネントとして利用できるコンポーネント一覧(アルファベット順)
 */
const CLIENT_COMPONENTS: string[] = [
  'AccordionPanel',        // 開閉状態の管理
  'AccordionPanelContent', // AccordionPanelItemContext
  'AccordionPanelItem',    // AccordionPanelItemContext
  'AccordionPanelTrigger', // AccordionPanelItemContext
  'ActionDialog',            // ダイアログ描画のためのcreatePortal
  'ActionDialogContent',     // ダイアログ描画のためのcreatePortal
  'ActionDialogWithTrigger', // ダイアログ描画のためのcreatePortal
  'Article',        // 見出しレベルの自動生成のため
  'Aside',          // 見出しレベルの自動生成のため
  'Base',           // 見出しレベルの自動生成のため
  'Button',         // live region を使うためのcreatePortal
  'CheckBox',       // indeterminate 状態管理のためのuseRef
  'Center',         // 見出しレベルの自動生成のため
  'Cluster',        // 見出しレベルの自動生成のため
  'Dialog',         // ダイアログ描画のためのcreatePortal
  'DialogContent',  // ダイアログ描画のためのcreatePortal
  'DialogCloser',   // ダイアログ開閉状態管理のためのuseContext
  'DialogTrigger',  // ダイアログ開閉状態管理のためのuseContext
  'DialogWrapper',  // ダイアログ開閉状態管理のためのuseState
  'DropZone',       // 選択されたファイル保持のためのuseRef
  'Heading',        // 見出しレベルの自動生成のため
  'Nav',            // 見出しレベルの自動生成のため
  'PageHeading',    // 見出しレベルの自動生成のため
  'Reel',           // 見出しレベルの自動生成のため
  'Section',        // 見出しレベルの自動生成のため
  'Sidebar',        // 見出しレベルの自動生成のため
  'Stack',          // 見出しレベルの自動生成のため
  'Tooltip',        // 開閉状態の管理
  'Textarea',       // オートフォーカスや文字数カウントのための状態管理
]

/**
 * サーバーコンポーネント内では利用できないコンポーネント一覧(アルファベット順)
 * FIXME: すべての use client を付与して CLIENT_COMPONENTS に移動する
 */
const DISABLED_COMPONENTS = [
  'AppLauncher',
  'AppNavi',
  'AppNaviDropdown',
  'AppNaviDropdownMenuButton',
  'BottomFixedArea',
  'BulkActionRow',
  'Calendar',
  'CurrencyInput',
  'DatePicker',
  'Dropdown',
  'DropdownCloser',
  'DropdownContent',
  'DropdownMenuButton',
  'DropdownTrigger',
  'EmptyTableBody',
  'Fieldset',
  'FilterDropdown',
  'FlashMessage',
  'FormControl',
  'FormDialog',
  'FormDialogContent',
  'Header',
  'HeaderDropdownMenuButton',
  'InformationPanel',
  'InputFile',
  'LanguageSwitcher',
  'LineClamp',
  'MessageDialog',
  'MessageDialogContent',
  'ModelessDialog',
  'MultiComboBox',
  'RadioButton',
  'RadioButtonPanel',
  'RemoteDialogTrigger',
  'RemoteTriggerActionDialog',
  'RemoteTriggerFormDialog',
  'RemoteTriggerMessageDialog',
  'SearchInput',
  'SegmentedControl',
  'Select',
  'SingleComboBox',
  'SortDropdown',
  'TabItem',
  'TableReel',
]

test.describe('RSC対応コンポーネントがRSCで利用できること', () => {
  for (const component of SERVER_COMPONENTS) {
    test(component, async ({ page }) => {
      await page.goto(`http://localhost:3000/rsc_test/${component}`)
      await expect(page.getByText('This is server component')).toBeVisible()
      await expect(page.getByText('Server Error')).not.toBeVisible()
    })
  }

  for (const component of CLIENT_COMPONENTS) {
    test(component, async ({ page }) => {
      await page.goto(`http://localhost:3000/rsc_test/${component}`)
      await expect(page.getByText('This is client component')).toBeVisible()
      await expect(page.getByText('Server Error')).not.toBeVisible()
    })
  }
})

test.describe('RSC非対応コンポーネントはRSCでエラーになること', () => {
  for (const component of DISABLED_COMPONENTS) {
    test(component, async ({ page }) => {
      await page.goto(`http://localhost:3000/rsc_test/${component}`)
      await expect(page.getByText(/Server Error|Unhandled Runtime Error/)).toBeVisible()
      await expect(page.getByText('This is server component')).not.toBeVisible()
      await expect(page.getByText('This is client component')).not.toBeVisible()
    })
  }
})
