'use client'

import { type ComponentProps, forwardRef, useMemo } from 'react'
import { tv } from 'tailwind-variants'

import { useIntl } from '../../intl'
import { Checkbox, type Props as CheckboxProps } from '../Checkbox'
import { ControlledTooltip } from '../Tooltip'

import { Th } from './Th'

type AbstractProps = Pick<ComponentProps<typeof Th>, 'vAlign' | 'fixed'>
type Props = AbstractProps & Omit<CheckboxProps, keyof AbstractProps>

const classNameGenerator = tv({
  slots: {
    inner: [
      'shr-group/label',
      'shr-relative shr-flex shr-justify-center shr-px-1 shr-py-0.75',
      '[&:not(:has([disabled]))]:shr-cursor-pointer',
    ],
    wrapper: 'shr-w-[theme(fontSize.base)] shr-p-0',
    checkbox: ['shr-leading-[0]', '[&>span]:shr-translate-y-[unset]'],
    balloon: [
      // 位置はセルの真ん中(50%)+checkboxの幅の半分(8px)+outlineの幅(4px)+Balloonの矢印の幅(5px), sr-onlyで隠す
      'shr-sr-only shr-absolute shr-left-[calc(50%+(theme(fontSize.base)/2)+4px+5px)]',
      // labelの中の要素に hover or focus-visible がある時のスタイル。shr-absoluteはshr-not-sr-onlyのpositionをabsoluteに上書きしている
      'group-has-[:hover,:focus-visible]/label:shr-not-sr-only group-has-[:hover,:focus-visible]/label:shr-absolute group-has-[:hover,:focus-visible]/label:shr-whitespace-nowrap',
    ],
  },
})

export const ThCheckbox = forwardRef<HTMLInputElement, Props>(
  ({ vAlign, fixed, className, ...rest }, ref) => {
    const { localize } = useIntl()

    const checkAllInvisibleLabel = useMemo(
      () =>
        localize({
          id: 'smarthr-ui/ThCheckbox/checkAllInvisibleLabel',
          defaultText: 'すべての項目を選択/解除',
        }),
      [localize],
    )

    const checkColumnName = useMemo(
      () =>
        localize({
          id: 'smarthr-ui/ThCheckbox/checkColumnName',
          defaultText: '選択',
        }),
      [localize],
    )

    const classNames = useMemo(() => {
      const { wrapper, inner, balloon, checkbox } = classNameGenerator()

      return {
        wrapper: wrapper({ className }),
        inner: inner(),
        balloon: balloon(),
        checkbox: checkbox(),
      }
    }, [className])

    return (
      // Th に必要な属性やイベントは不要
      <Th vAlign={vAlign} fixed={fixed} className={classNames.wrapper} aria-label={checkColumnName}>
        <label className={classNames.inner}>
          <ControlledTooltip
            as="span"
            horizontal="left"
            vertical="middle"
            className={classNames.balloon}
          >
            <span className="shr-block shr-p-0.5">{checkAllInvisibleLabel}</span>
          </ControlledTooltip>
          {/* eslint-disable-next-line smarthr/a11y-prohibit-checkbox-or-radio-in-table-cell */}
          <Checkbox {...rest} ref={ref} className={classNames.checkbox} />
        </label>
      </Th>
    )
  },
)
