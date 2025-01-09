import React, { ComponentProps, forwardRef, useMemo } from 'react'
import { tv } from 'tailwind-variants'

import { Balloon } from '../Balloon'
import { CheckBox, Props as CheckBoxProps } from '../CheckBox'

import { Th } from './Th'

import type { DecoratorsType } from '../../types'

type Props = {
  decorators?: DecoratorsType<'checkAllInvisibleLabel'> & {
    checkColumnName?: (text: string) => string
  }
} & Pick<ComponentProps<typeof Th>, 'vAlign'>

const CHECK_ALL_INVISIBLE_LABEL = 'すべての項目を選択/解除'
const CHECK_COLUMN_NAME = '選択'

const thCheckbox = tv({
  slots: {
    inner: [
      'shr-group/label',
      'shr-relative shr-flex shr-justify-center shr-py-0.75 shr-px-1',
      '[&:not(:has([disabled]))]:shr-cursor-pointer',
    ],
    wrapper: 'shr-p-0 shr-w-[theme(fontSize.base)]',
    checkbox: ['shr-leading-[0]', '[&>span]:shr-translate-y-[unset]'],
    balloon: [
      // 位置はセルの真ん中(50%)+checkboxの幅の半分(8px)+outlineの幅(4px)+Balloonの矢印の幅(5px), sr-onlyで隠す
      'shr-absolute shr-left-[calc(50%+(theme(fontSize.base)/2)+4px+5px)] shr-sr-only',
      // labelの中の要素に hover or focus-visible がある時のスタイル。shr-absoluteはshr-not-sr-onlyのpositionをabsoluteに上書きしている
      'group-has-[:hover,:focus-visible]/label:shr-not-sr-only group-has-[:hover,:focus-visible]/label:shr-absolute group-has-[:hover,:focus-visible]/label:shr-whitespace-nowrap',
    ],
  },
})

export const ThCheckbox = forwardRef<HTMLInputElement, CheckBoxProps & Props>(
  ({ vAlign, decorators, className, ...others }, ref) => {
    const { wrapperStyle, innerStyle, balloonStyle, checkboxStyle } = useMemo(() => {
      const { wrapper, inner, balloon, checkbox } = thCheckbox()

      return {
        wrapperStyle: wrapper({ className }),
        innerStyle: inner(),
        balloonStyle: balloon(),
        checkboxStyle: checkbox(),
      }
    }, [className])

    const decorated = useMemo(() => {
      if (!decorators) {
        return {
          checkAllInvisibleLabel: CHECK_ALL_INVISIBLE_LABEL,
          checkColumnName: CHECK_COLUMN_NAME,
        }
      }

      return {
        checkAllInvisibleLabel:
          decorators.checkAllInvisibleLabel?.(CHECK_ALL_INVISIBLE_LABEL) ||
          CHECK_ALL_INVISIBLE_LABEL,
        checkColumnName: decorators.checkColumnName?.(CHECK_COLUMN_NAME) || CHECK_COLUMN_NAME,
      }
    }, [decorators])

    return (
      // Th に必要な属性やイベントは不要
      <Th vAlign={vAlign} className={wrapperStyle} aria-label={decorated.checkColumnName}>
        {/* eslint-disable-next-line jsx-a11y/label-has-associated-control */}
        <label className={innerStyle}>
          <Balloon as="span" horizontal="left" vertical="middle" className={balloonStyle}>
            <span className="shr-p-0.5 shr-block">{decorated.checkAllInvisibleLabel}</span>
          </Balloon>
          <CheckBox {...others} ref={ref} className={checkboxStyle} />
        </label>
      </Th>
    )
  },
)
