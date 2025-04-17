import { tv } from 'tailwind-variants'

const MIN_WIDTH = {
  DatetimeLocal: '14em',
  Month: '11em',
  Time: '7em',
} as const

/**
 * @param componentType
 * コンポーネントのタイプ (例: 'Time')
 */
export const classNameGenerator = (componentType: keyof typeof MIN_WIDTH) =>
  tv({
    slots: {
      wrapper: [
        `smarthr-ui-${componentType}Picker`,
        'shr-inline-block shr-border-shorthand shr-rounded-m shr-bg-white shr-px-0.5 shr-leading-none',
        'contrast-more:shr-border-high-contrast',
        'focus-within:shr-focus-indicator',
        'has-[[aria-invalid]]:shr-border-danger',
        'has-[:disabled]:shr-pointer-events-none has-[:disabled]:shr-bg-white-darken has-[:disabled]:[&&&]:shr-border-default/50',
        'has-[[readonly]]:shr-border-[theme(backgroundColor.background)] has-[[readonly]]:shr-bg-background',
      ],
      inner: [
        'shr-bg-transparent shr-border-none shr-outline-none shr-outline-0',
        'shr-p-[unset] shr-py-0.75 shr-h-[theme(fontSize.base)]',
        'shr-text-base shr-text-black shr-tabular-nums',
        'disabled:shr-text-disabled',
        `shr-min-w-[${MIN_WIDTH[componentType]}]`,
      ],
    },
  })()
