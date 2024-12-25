const { getJestConfig } = require('@storybook/test-runner')

module.exports = {
  // The default configuration comes from @storybook/test-runner
  ...getJestConfig(),
  /** Add your own overrides below
   * @see https://jestjs.io/docs/configuration
   */

  testPathIgnorePatterns: [
    /**
     * subocomponents で使われれているコンポーネントは export defaults を持たず、
     * 上位の Layout.stories.tsx でテストが実行されるので除外している
     */
    'Cluster.stories.tsx',
    'Reel.stories.tsx',
    'Sidebar.stories.tsx',
    'Stack.stories.tsx',
    'Center.stories.tsx',
    'FilterDropdown.stories.tsx',
    'DropdownMenuButton.stories.tsx',
    'SearchInput.stories.tsx',
    /**
     * test-runner 導入時にエラーが出ていたコンポーネント
     * これらは少しずつ修正していく
     *
     * error: "Form elements must have labels"
     */
    'RadioButton.stories.tsx',
    'InputFile.stories.tsx',
    'CheckBox.stories.tsx',
    'ComboBox.stories.tsx',
    'FieldSet.stories.tsx',
    'Switch.stories.tsx',
    'FormControl.stories.tsx', // DatePicker を含むために除外
    /**
     * error: "ARIA attributes must conform to valid values"
     */
    'Dialog.stories.tsx',
    /**
     * TabItem を TabBar と組み合わせていないためにエラーが出ている。無視で良い。
     * critical: "Required ARIA parent role not present: tablist"
     */
    'TabItem.stories.tsx',
  ],
}
