const { getJestConfig } = require('@storybook/test-runner')

module.exports = {
  // The default configuration comes from @storybook/test-runner
  ...getJestConfig(),
  /** Add your own overrides below
   * @see https://jestjs.io/docs/configuration
   */
  /**
   * subocomponents で使われれているコンポーネントは export defaults を持たず、
   * 上位の Layout.stories.tsx でテストが実行されるので除外している
   */
  testPathIgnorePatterns: [
    'Cluster.stories.tsx',
    'LineUp.stories.tsx',
    'Reel.stories.tsx',
    'Sidebar.stories.tsx',
    'Stack.stories.tsx',
    'FilterDropdown.stories.tsx',
    'DropdownButton.stories.tsx',
  ],
}
