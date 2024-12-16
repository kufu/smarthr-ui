import smarthr from 'eslint-config-smarthr'
import storybook from 'eslint-plugin-storybook'

/**
 * @type {import('eslint').Linter.Config[]}
 */
export default [
  ...smarthr,
  ...storybook.configs['flat/recommended'],
  {
    rules: {
      'jsx-a11y/anchor-is-valid': 'warn',
      'jsx-a11y/click-events-have-key-events': 'warn',
      'jsx-a11y/no-static-element-interactions': 'warn',
      'jsx-a11y/label-has-associated-control': [
        'error',
        {
          controlComponents: ['Input', 'InputWithTooltip'],
        },
      ],
      '@typescript-eslint/consistent-type-definitions': [
        'error',
        'type',
      ],
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
    },
  },
  {
    ignores: [
      'sandbox/',
      'storybook-static/',
      'packages/smarthr-ui/esm/',
      'packages/smarthr-ui/lib/',
      'packages/smarthr-ui/.storybook',
    ]
  },
]