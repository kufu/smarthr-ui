import { tv } from 'tailwind-variants'

export const backgroundColor = {
  BACKGROUND: 'background',
  COLUMN: 'column',
  BASE_GREY: 'base-grey',
  OVER_BACKGROUND: 'over-background',
  HEAD: 'head',
  BORDER: 'border',
  ACTION_BACKGROUND: 'action-background',
} as const

export const classNameGenerator = tv({
  slots: {
    wrapper: [
      'smarthr-ui-Input',
      'shr-border-shorthand shr-box-border shr-inline-flex shr-cursor-text shr-items-center shr-gap-0.5 shr-rounded-m shr-bg-white shr-px-0.5',
      'contrast-more:shr-border-high-contrast',
      'focus-within:shr-focus-indicator',
      'has-[[aria-invalid]]:shr-border-danger',
      'has-[:disabled]:[&&&]:shr-border-default/50',
      'has-[:disabled]:shr-pointer-events-none has-[:disabled]:shr-bg-white-darken',
      'has-[[readonly]:not(:disabled)]:[&&&]:shr-border-[theme(backgroundColor.column)] has-[[readonly]:not(:disabled)]:[&&&]:shr-bg-column',
    ],
    input: [
      'smarthr-ui-Input-input',
      'shr-inline-block shr-w-full shr-grow shr-border-none shr-bg-transparent shr-py-0.75 shr-text-base shr-leading-none shr-text-black shr-outline-none shr-outline-0',
      'placeholder:shr-text-grey',
      'disabled:shr-text-disabled disabled:shr-opacity-100',
      'shr-h-[theme(fontSize.base)]',
      // HINT: 日付系inputがsafariなどで対応されていないため、input要素内が空白になりフォームが潰れる場合がある
      // マジックナンバーになるが、ほかに適切なプロパティがないため、min-widthで最低幅を指定することで防ぐ
      '[&[type="datetime-local"]]:shr-min-w-[11em] [&[type="month"]]:shr-min-w-[8em] [&[type="time"]]:shr-min-w-[5em]',
    ],
    affix: [
      'shr-flex shr-shrink-0 shr-items-center shr-text-grey',
      '[.smarthr-ui-Input:has(:disabled)_&]:shr-text-disabled [.smarthr-ui-Input:has(:disabled)_&]:shr-opacity-100',
    ],
  },
})
