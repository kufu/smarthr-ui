import { tv } from 'tailwind-variants'

// HINT: 日付系inputがsafariなどで対応されていないため、input要素内が空白になりフォームが潰れる場合がある
// マジックナンバーになるが、ほかに適切なプロパティがないため、min-widthで最低幅を指定することで防ぐ

export const classNameGenerator = tv({
  slots: {
    wrapper: [
      'shr-border-shorthand shr-inline-block shr-rounded-m shr-bg-white shr-px-0.5 shr-leading-none',
      'contrast-more:shr-border-high-contrast',
      'focus-within:shr-focus-indicator',
      'has-[[aria-invalid]]:shr-border-danger',
      'has-[:disabled]:shr-pointer-events-none has-[:disabled]:shr-bg-white-darken has-[:disabled]:[&&&]:shr-border-default/50',
      'has-[[readonly]]:shr-border-[theme(backgroundColor.column)] has-[[readonly]]:shr-bg-column',
    ],
    inner: [
      'shr-h-[theme(fontSize.base)] shr-border-none shr-bg-transparent shr-p-[unset] shr-py-0.75 shr-text-base shr-tabular-nums shr-text-black shr-outline-none shr-outline-0',
      'disabled:shr-text-disabled',
    ],
  },
  variants: {
    componentType: {
      DatetimeLocal: {
        wrapper: 'smarthr-ui-DatetimeLocalPicker',
        inner: 'shr-min-w-[14em]',
      },
      Month: {
        wrapper: 'smarthr-ui-MonthPicker',
        inner: 'shr-min-w-[11em]',
      },
      Time: {
        wrapper: 'smarthr-ui-TimePicker',
        inner: 'shr-min-w-[7em]',
      },
    },
  },
})
