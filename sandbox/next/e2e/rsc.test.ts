import test, { expect } from '@playwright/test'

/**
 * サーバーコンポーネントとして利用できるコンポーネント一覧(アルファベット順)
 */
const SERVER_COMPONENTS = [
  'AnchorButton',
  'AppLauncher',
  'AppNavi',
  'AppNaviAnchor',
  'AppNaviButton',
  'AppNaviCustomTag',
  'AppNaviDropdown',
  'AppNaviDropdownMenuButton',
  'Badge',
  'Balloon',
  'BaseColumn',
  'Chip',
  'DefinitionList',
  'DefinitionListItem',
  'DatetimeLocalPicker',
  'ErrorScreen',
  'Fieldset',
  'FloatArea',
  'Header',
  'HeaderDropdownMenuButton',
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
  'SearchInput',
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
  'Article',        // 見出しレベルの自動生成のため
  'Aside',          // 見出しレベルの自動生成のため
  'Base',           // 見出しレベルの自動生成のため
  'Button',         // live region を使うためのcreatePortal
  'BottomFixedArea', // children のバリデーションのための useEffect
  'BulkActionRow',  // 件数計算のためのuseStateなど
  'CheckBox',       // indeterminate 状態管理のためのuseRef
  'Center',         // 見出しレベルの自動生成のため
  'Cluster',        // 見出しレベルの自動生成のため
  'CurrencyInput',  // フォーマット変換のためのuseEffect
  'DatePicker',     // カレンダー表示のためのcreatePortal
  'Dialog',         // ダイアログ描画のためのcreatePortal
  'DialogContent',  // ダイアログ描画のためのcreatePortal
  'DialogCloser',   // ダイアログ開閉状態管理のためのuseContext
  'DialogTrigger',  // ダイアログ開閉状態管理のためのuseContext
  'DialogWrapper',  // ダイアログ開閉状態管理のためのuseState
  'Dropdown',        // 開閉状態管理のためのuseStateなど
  'DropdownCloser',  // 開閉状態管理のためのuseContext
  'DropdownContent', // 開閉状態管理のためのuseContext
  'DropdownTrigger', // 開閉状態管理のためのuseContext
  'DropdownMenuButton', // キーボード操作のためのuseRef
  'EmptyTableBody', // テーブルヘッダーのカウントのためのuseRef
  'FormControl',    // Input要素への自動紐づけのためのuseRefなど
  'Heading',        // 見出しレベルの自動生成のため
  'Input',          // オートフォーカスのためのuseRefなど
  'InputFile',      // ファイル選択のためのuseStateなど
  'InformationPanel', // 開閉状態の管理のためのuseState
  'LanguageSwitcher', // イベントハンドラを含むため
  'LineClamp',      // ツールチップ開閉管理のためのuseState
  'ModelessDialog', // ダイアログ描画のためのcreatePortal
  'MultiComboBox',  // プルダウン表示のためのcreatePortalなど
  'Nav',            // 見出しレベルの自動生成のため
  'PageHeading',    // 見出しレベルの自動生成のため
  'RadioButton',    // イベントハンドラを含むため
  'RadioButtonPanel',           // パネルをクリックしてもラジオを選択できるようにするための useRef
  'Reel',                       // 見出しレベルの自動生成のため
  'RemoteDialogTrigger',        // children を clone するため
  'RemoteTriggerMessageDialog', // ダイアログ開閉管理のためのuseState
  'SegmentedControl', // フォーカス管理のためのuseRefなど
  'Section',        // 見出しレベルの自動生成のため
  'Select',         // イベントハンドラを含むため
  'Sidebar',        // 見出しレベルの自動生成のため
  'SingleComboBox', // プルダウン表示のためのcreatePortalなど
  'Stack',          // 見出しレベルの自動生成のため
  'TableReel',      // scroll監視のためのuseEffect
  'Tooltip',        // 開閉状態の管理
  'Textarea',       // オートフォーカスや文字数カウントのための状態管理
]

/**
 * サーバーコンポーネント内では利用できないコンポーネント一覧(アルファベット順)
 */
const DISABLED_COMPONENTS = [
  'ActionDialog',            // 必須のイベントハンドラをもつため
  'ActionDialogContent',     // 必須のイベントハンドラをもつため
  'ActionDialogWithTrigger', // 必須のイベントハンドラをもつため
  'Calendar',                // 必須のイベントハンドラをもつため
  'DropZone',                // 必須のイベントハンドラをもつため
  'FilterDropdown',          // 必須のイベントハンドラをもつため
  'FlashMessage',            // 必須のイベントハンドラをもつため
  'FormDialog',              // 必須のイベントハンドラをもつため
  'FormDialogContent',       // 必須のイベントハンドラをもつため
  'MessageDialog',           // 必須のイベントハンドラをもつため
  'MessageDialogContent',    // 必須のイベントハンドラを持つため
  'RemoteTriggerActionDialog',  // 必須のイベントハンドラをもつため
  'RemoteTriggerFormDialog',    // 必須のイベントハンドラをもつため
  'SortDropdown',           // 必須のイベントハンドラをもつため
  'TabItem',                // 必須のイベントハンドラをもつため
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
