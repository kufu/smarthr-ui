import React, { forwardRef, useMemo } from 'react'
import { tv } from 'tailwind-variants'

import { Balloon } from '../Balloon'
import { CheckBox, Props as CheckBoxProps } from '../CheckBox'
import { Center } from '../Layout'

import { Th } from './Th'

import type { DecoratorsType } from '../../types'

type Props = {
  decorators?: DecoratorsType<'checkAllInvisibleLabel'> & {
    checkColumnName?: (text: string) => string
  }
}

const CHECK_ALL_INVISIBLE_LABEL = 'すべての項目を選択/解除'
const CHECK_COLUMN_NAME = '選択'

const thCheckbox = tv({
  slots: {
    inner: 'shr-absolute shr-inset-0 [&:not(:has([disabled]))]:shr-cursor-pointer shr-group/label',
    wrapper: 'shr-relative shr-w-[theme(fontSize.base)] [&]:shr-px-0.75',
    checkbox: '[&]:shr-block',
    balloon: [
      // 位置はセルの真ん中(50%)+checkboxの幅の半分(8px)+outlineの幅(4px)+Balloonの矢印の幅(5px), sr-onlyで隠す
      'shr-absolute shr-left-[calc(50%+(theme(fontSize.base)/2)+4px+5px)] shr-sr-only',
      // labelの中の要素に hover or focus-visible がある時のスタイル。shr-absoluteはshr-not-sr-onlyのpositionをabsoluteに上書きしている
      'group-has-[:hover,:focus-visible]/label:shr-not-sr-only group-has-[:hover,:focus-visible]/label:shr-absolute group-has-[:hover,:focus-visible]/label:shr-whitespace-nowrap',
    ],
  },
})

export const ThCheckbox = forwardRef<HTMLInputElement, CheckBoxProps & Props>(
  ({ decorators, className, ...others }, ref) => {
    const { wrapperStyle, innerStyle, balloonStyle, checkboxStyle } = useMemo(() => {
      const { wrapper, inner, balloon, checkbox } = thCheckbox()
      return {
        wrapperStyle: wrapper({ className }),
        innerStyle: inner(),
        checkboxStyle: checkbox(),
        balloonStyle: balloon(),
      }
    }, [className])

    const checkAllInvisibleLabel = useMemo(() => {
      if (decorators && decorators.checkAllInvisibleLabel) {
        return decorators.checkAllInvisibleLabel(CHECK_ALL_INVISIBLE_LABEL)
      }

      return CHECK_ALL_INVISIBLE_LABEL
    }, [decorators])

    const checkColumnName = useMemo(() => {
      if (decorators && decorators.checkColumnName) {
        return decorators.checkColumnName(CHECK_COLUMN_NAME)
      }

      return CHECK_COLUMN_NAME
    }, [decorators])

    return (
      // Th に必要な属性やイベントは不要
      <Th className={wrapperStyle} aria-label={checkColumnName}>
        <Center as="label" verticalCentering className={innerStyle}>
          <Balloon as="span" horizontal="left" vertical="middle" className={balloonStyle}>
            <span className="shr-p-0.5 shr-block">{checkAllInvisibleLabel}</span>
          </Balloon>
          <CheckBox {...others} ref={ref} className={checkboxStyle} />
        </Center>
      </Th>
    )
  },
)
