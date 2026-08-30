import smarthr from 'eslint-config-smarthr'
import perfectionist from 'eslint-plugin-perfectionist'
import storybook from 'eslint-plugin-storybook'
import bestPracticeForUseLatest from './eslint-local-rules/best-practice-for-use-latest.js'

/**
 * @type {import('eslint').Linter.Config[]}
 */
export default [
  ...smarthr,
  ...storybook.configs['flat/recommended'],
  {
    plugins: {
      'local-rules': {
        rules: {
          'best-practice-for-use-latest': bestPracticeForUseLatest,
        },
      },
      perfectionist,
    },
    rules: {
      'local-rules/best-practice-for-use-latest': 'error',
      'perfectionist/sort-jsx-props': [
        'error',
        {
          type: 'unsorted',
          groups: [
            'key', 'as', 'namedAs', 'ref', 'namedRef',
            'role', 'type', 'id', 'htmlFor', 'form',
            'name', 'required', 'disabled', 'readOnly', 'value', 'checked',
            'linkAttribute',
            'unknown',
            'tabIndex',
            'title',
            'styleType', 'size', 'width', 'decoration', 'className', 'style',
            'ariaAttribute', 'dataAttribute',
            'functions', 'setCallback', 'onCallback', 'handleCallback',
            'prefix', 'headerLike', 'trigger', 'children', 'items', 'button', 'suffix',
          ],
          customGroups: [
            { groupName: 'key', elementNamePattern: '^key$' },
            { groupName: 'as', elementNamePattern: '^as$' },
            { groupName: 'namedAs', elementNamePattern: '^.+As$' },
            { groupName: 'ref', elementNamePattern: '^ref$' },
            { groupName: 'namedRef', elementNamePattern: '^.+Ref$' },
            { groupName: 'role', elementNamePattern: '^role$' },
            { groupName: 'type', elementNamePattern: '^type$' },
            { groupName: 'id', elementNamePattern: '(^id|Id)$' },
            { groupName: 'htmlFor', elementNamePattern: '^htmlFor$' },
            { groupName: 'form', elementNamePattern: '^form$' },
            { groupName: 'name', elementNamePattern: '^name$' },
            { groupName: 'required', elementNamePattern: '^required$' },
            { groupName: 'disabled', elementNamePattern: '^disabled(Reason)?$' },
            { groupName: 'readOnly', elementNamePattern: '^readOnly$' },
            { groupName: 'value', elementNamePattern: '^(value|defaultValue)$' },
            { groupName: 'checked', elementNamePattern: '^(checked|selected(.+)?)$' },
            { groupName: 'linkAttribute', elementNamePattern: '^(href|target|rel)$' },
            { groupName: 'tabIndex', elementNamePattern: '^tabIndex$' },
            { groupName: 'title', elementNamePattern: '^title$' },
            { groupName: 'styleType', elementNamePattern: '^(styleType|variant)$' },
            { groupName: 'size', elementNamePattern: '^size$' },
            { groupName: 'setCallback', elementNamePattern: '^set[A-Z]' },
            { groupName: 'width', elementNamePattern: '((^w|W)idth|(^h|H)eight)$' },
            { groupName: 'decoration', elementNamePattern: '^(color|wide|weight|leading|triggerType|innerMargin|padding)$' },
            { groupName: 'className', elementNamePattern: '(^c|C)lassName(s)?$' },
            { groupName: 'style', elementNamePattern: '^style$' },
            { groupName: 'ariaAttribute', elementNamePattern: '^aria' },
            { groupName: 'dataAttribute', elementNamePattern: '^data-' },
            { groupName: 'functions', elementNamePattern: '^functions$' },
            { groupName: 'onCallback', elementNamePattern: '^on[A-Z]' },
            { groupName: 'handleCallback', elementNamePattern: '^handle[A-Z]' },
            { groupName: 'prefix', elementNamePattern: '^(prefix|icon)$' },
            { groupName: 'headerLike', elementNamePattern: '^(header|heading|label|legend)$' },
            { groupName: 'trigger', elementNamePattern: '^trigger$' },
            { groupName: 'children', elementNamePattern: '^(children|message)$' },
            { groupName: 'items', elementNamePattern: '((^i|I)tems|(^o|O)ptions)$' },
            { groupName: 'button', elementNamePattern: 'Button$' },
            { groupName: 'suffix', elementNamePattern: '(^suffix|^footer|^subActionArea|Message)$' },
          ],
        },
      ],
      '@typescript-eslint/consistent-type-definitions': ['error', 'type'],
      '@typescript-eslint/consistent-type-imports': [
        'error',
        {
          fixStyle: 'inline-type-imports',
        },
      ],
      '@typescript-eslint/no-import-type-side-effects': 'error',
      '@typescript-eslint/no-unused-vars': [
        'error',
        {
          argsIgnorePattern: '^_',
          varsIgnorePattern: '^_',
          caughtErrorsIgnorePattern: '^_',
          destructuredArrayIgnorePattern: '^_',
        },
      ],
      'jsx-a11y/anchor-is-valid': 'error',
      'jsx-a11y/click-events-have-key-events': 'error',
      'jsx-a11y/label-has-associated-control': [
        'error',
        {
          controlComponents: ['Input', 'InputWithTooltip'],
        },
      ],
      'jsx-a11y/mouse-events-have-key-events': 'error',
      'jsx-a11y/no-noninteractive-element-interactions': 'error',
      'jsx-a11y/no-noninteractive-element-to-interactive-role': [
        'error',
        {
          menu: ['menu'],
        },
      ],
      'jsx-a11y/no-static-element-interactions': 'error',
      'jsx-a11y/role-has-required-aria-props': 'error',
      'react-hooks/exhaustive-deps': 'error',
      'smarthr/a11y-anchor-has-href-attribute': [
        'error',
        {
          checkType: 'allow-spread-attributes',
        },
      ],
      'smarthr/a11y-input-has-name-attribute': [
        'error',
        {
          checkType: 'allow-spread-attributes',
        },
      ],
      'smarthr/best-practice-for-consecutive-definition-list': 'off',
      'smarthr/best-practice-for-default-props': 'off',
      'smarthr/best-practice-for-prohibit-import-smarthr-ui-local': 'off',
      'smarthr/design-system-guideline-bulk-action-row-button': 'off',
      'smarthr/best-practice-for-rest-parameters': 'error',
      'smarthr/best-practice-for-unnesessary-early-return': 'error',
      'smarthr/best-practice-for-lazy-variable': ['error', { fix: true }],
      'smarthr/best-practice-for-no-unnecessary-variable': [
        'error',
        {
          fix: false,
          maxComplexity: 3,
        },
      ],
      'no-restricted-syntax': [
        'error',
        {
          selector: 'ExportAllDeclaration',
          message: 'export * は使用できません。明示的なexportを使用してください。',
        },
        {
          selector: 'ExportNamedDeclaration[specifiers.0.type="ExportNamespaceSpecifier"]',
          message: 'export * as は使用できません。個別にimportしてオブジェクトを構築してください。',
        },
        {
          selector: 'ImportNamespaceSpecifier',
          message: 'import * as は使用できません。個別にimportしてください。',
        },
      ],
    },
  },
  {
    files: ['**/ja.ts'],
    rules: {
      'smarthr/require-i18n-translation-sync': 'error',
    },
  },
  {
    ignores: [
      'sandbox/',
      'storybook-static/',
      'packages/smarthr-ui/esm/',
      'packages/smarthr-ui/lib/',
    ],
  },
  {
    files: ['**/*.test.ts', '**/*.test.tsx', '**/__tests__/**', '**/*.stories.tsx', 'packages/smarthr-ui/.storybook'],
    rules: {
      'smarthr/require-i18n-text': 'off',
      'smarthr/best-practice-for-lazy-variable': 'off',
      'smarthr/best-practice-for-no-unnecessary-variable': 'off',
    },
  },
  {
    files: ['**/*.stories.tsx', 'packages/smarthr-ui/.storybook'],
    rules: {
      'smarthr/a11y-form-control-in-form': 'off',
      'smarthr/a11y-heading-in-sectioning-content': 'off',
      'smarthr/a11y-input-in-form-control': 'off',
    },
  },
]
