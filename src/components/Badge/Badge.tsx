import React, { ComponentPropsWithoutRef, PropsWithChildren, useMemo } from 'react'
import { VariantProps, tv } from 'tailwind-variants'

import { Text } from '../Text'

type BaseProps = PropsWithChildren<{
  /** 件数 */
  count?: number
  /** 最大表示件数。この数を超えた場合は{最大表示件数+}と表示される */
  overflowCount?: number
  /** 0値を表示するかどうか */
  showZero?: boolean
  /** 色の種類 */
  type?: VariantProps<typeof badge>['color']
  /** ドット表示するかどうか */
  dot?: boolean
}>
type BadgeProps = Omit<ComponentPropsWithoutRef<'span'>, keyof BaseProps> & BaseProps

const badge = tv({
  slots: {
    wrapper: 'smarthr-ui-Badge shr-relative shr-inline-flex',
    pill: ['shr-h-[1.75em] shr-min-w-[1.75em] shr-px-[0.5em] shr-tabular-nums'],
    dotElement: ['shr-h-[0.625em] shr-w-[0.625em]'],
  },
  variants: {
    color: {
      grey: {},
      blue: {},
      yellow: {},
      red: {},
    },
    withChildren: {
      true: {},
    },
  },
  compoundSlots: [
    {
      slots: ['pill', 'dotElement'],
      className: [
        'shr-box-border shr-flex shr-items-center shr-justify-center',
        'shr-rounded-full',
      ],
    },
    {
      slots: ['pill', 'dotElement'],
      withChildren: true,
      className: [
        'shr-absolute -shr-translate-y-1/2 shr-translate-x-1/2 [inset-block-start:0] [inset-inline-end:0]',
      ],
    },
    {
      slots: ['pill', 'dotElement'],
      color: 'blue',
      className: 'shr-bg-main',
    },
    {
      slots: ['pill', 'dotElement'],
      color: 'yellow',
      className: 'shr-bg-warning-yellow',
    },
    {
      slots: ['pill', 'dotElement'],
      color: 'red',
      className: 'shr-bg-danger',
    },
    {
      slots: ['pill', 'dotElement'],
      color: 'grey',
      className: 'shr-bg-[theme(colors.grey.65)]',
    },
    {
      slots: ['pill', 'dotElement'],
      color: ['grey', 'blue', 'red'],
      className: 'shr-shadow-[0_0_0_1px_theme(colors.white)]',
    },
    {
      slots: ['pill', 'dotElement'],
      color: 'yellow',
      className: 'shr-shadow-[0_0_0_1px_theme(colors.black)]',
    },
    {
      slots: ['pill'],
      color: ['grey', 'blue', 'red'],
      className: 'shr-text-white',
    },
    {
      slots: ['pill'],
      color: ['yellow'],
      className: 'shr-text-black',
    },
  ],
})

export const Badge: React.FC<BadgeProps> = ({
  count,
  overflowCount = 99,
  showZero = false,
  type = 'blue',
  dot = false,
  children,
  className,
  ...props
}) => {
  const actualCount = count && count > 0 ? count : showZero ? 0 : undefined

  const { wrapperStyle, pillStyle, dotStyle } = useMemo(() => {
    const { wrapper, pill, dotElement } = badge({ color: type, withChildren: !!children })
    return {
      wrapperStyle: wrapper({ className }),
      pillStyle: pill(),
      dotStyle: dotElement(),
    }
  }, [children, className, type])

  // ドット表示でもなく、0値を表示するでもない場合は何も表示しない
  if (!dot && !children && actualCount === undefined) return null

  return (
    <span {...props} className={wrapperStyle}>
      {children}
      {dot ? (
        <span className={dotStyle} />
      ) : (
        actualCount !== undefined && (
          <Text size="XS" className={pillStyle}>
            {actualCount > overflowCount ? `${overflowCount}+` : actualCount}
          </Text>
        )
      )}
    </span>
  )
}
