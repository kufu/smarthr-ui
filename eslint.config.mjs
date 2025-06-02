import smarthr from 'eslint-config-smarthr'
import storybook from 'eslint-plugin-storybook'

/**
 * @type {import('eslint').Linter.Config[]}
 */
export default [...smarthr, ...storybook.configs['flat/recommended'], {
  rules: {
    'jsx-a11y/anchor-is-valid': 'error',
    'jsx-a11y/click-events-have-key-events': 'error',
    'jsx-a11y/no-static-element-interactions': 'error',
    'jsx-a11y/label-has-associated-control': [
      'error',
      {
        controlComponents: ['Input', 'InputWithTooltip'],
      },
    ],
    'jsx-a11y/role-has-required-aria-props': 'error',
    'jsx-a11y/mouse-events-have-key-events': 'error',
    'jsx-a11y/no-noninteractive-element-interactions': 'error',
    '@typescript-eslint/consistent-type-definitions': [
      'error',
      'type',
    ],
    'react-hooks/exhaustive-deps': 'error',
    'smarthr/require-barrel-import': 'off',
    'smarthr/a11y-anchor-has-href-attribute': [
      'error',
      {
        checkType: 'allow-spread-attributes',
      }
    ],
    'smarthr/a11y-input-has-name-attribute': [
      'error',
      {
        checkType: 'allow-spread-attributes',
      }
    ],
    'smarthr/a11y-prohibit-sectioning-content-in-form': 'error',
    '@typescript-eslint/consistent-type-imports': [
      'error',
      {
        fixStyle: 'inline-type-imports',
      }
    ],
    '@typescript-eslint/no-import-type-side-effects': 'error',
  },
}, {
  ignores: [
    '**/*.{mjs,js}',
    '**/*.stories.tsx',
    'sandbox/',
    'storybook-static/',
    'packages/smarthr-ui/esm/',
    'packages/smarthr-ui/lib/',
    'packages/smarthr-ui/.storybook',
  ]
}, ...storybook.configs["flat/recommended"]];
