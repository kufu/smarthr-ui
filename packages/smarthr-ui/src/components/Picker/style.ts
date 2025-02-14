import { tv } from 'tailwind-variants'

/**
 * @param componentType
 * コンポーネントのタイプ (例: 'Time')
 */
export const pickerStyle = (componentType: string) =>
  tv({
    slots: {
      wrapper: [
        `smarthr-ui-${componentName}Picker`,
        'shr-inline-block shr-border-shorthand shr-rounded-m shr-bg-white shr-px-0.5 shr-leading-none',
        'contrast-more:shr-border-high-contrast',
        'focus-within:shr-focus-indicator',
        'has-[[aria-invalid]]:shr-border-danger',
      ],
      inner: [
        'shr-border-none shr-text-base disabled:shr-text-disabled shr-bg-transparent shr-text-black shr-outline-none shr-outline-0 shr-p-[unset] shr-py-0.75 shr-h-[theme(fontSize.base)] shr-tabular-nums',
      ],
    },
    variants: {
      disabled: {
        true: {
          wrapper: 'shr-pointer-events-none shr-bg-white-darken [&&&]:shr-border-default/50',
        },
      },
      readOnly: {
        true: {
          wrapper: '[&&&]:shr-border-[theme(backgroundColor.background)] [&&&]:shr-bg-background',
        },
      },
    },
  })()
