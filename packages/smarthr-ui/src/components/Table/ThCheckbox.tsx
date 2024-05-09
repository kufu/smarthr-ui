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
    inner: 'shr-absolute shr-inset-0 [&:not(:has([disabled]))]:shr-cursor-pointer shr-group',
    wrapper: 'shr-relative shr-w-[theme(fontSize.base)] [&]:shr-px-0.75',
    balloon:
      '[&]:shr-absolute shr-left-[38px] shr-translate-y-[1px] shr-sr-only group-has-[:hover,:focus-visible]:shr-not-sr-only group-has-[:hover,:focus-visible]:shr-absolute group-has-[:hover,:focus-visible]:shr-whitespace-nowrap',
  },
})

export const ThCheckbox = forwardRef<HTMLInputElement, CheckBoxProps & Props>(
  ({ decorators, className, ...others }, ref) => {
    const { wrapperStyle, innerStyle, balloonStyle } = useMemo(() => {
      const { wrapper, inner, balloon } = thCheckbox()
      return {
        wrapperStyle: wrapper({ className }),
        innerStyle: inner(),
        balloonStyle: balloon(),
      }
    }, [className])

    const checkAllInvisibleLabel =
      decorators?.checkAllInvisibleLabel?.(CHECK_ALL_INVISIBLE_LABEL) || CHECK_ALL_INVISIBLE_LABEL
    const checkColumnName = decorators?.checkColumnName?.(CHECK_COLUMN_NAME) || CHECK_COLUMN_NAME

    return (
      // Th に必要な属性やイベントは不要
      <Th className={wrapperStyle} aria-label={checkColumnName}>
        <Center as="label" verticalCentering className={innerStyle}>
          <Balloon horizontal="left" vertical="middle" className={balloonStyle}>
            <p className="shr-p-0.5">{checkAllInvisibleLabel}</p>
          </Balloon>
          {/* 使う側で lint をかけるため無効化 */}
          {/* eslint-disable-next-line smarthr/a11y-input-has-name-attribute  */}
          <CheckBox {...others} ref={ref} />
        </Center>
      </Th>
    )
  },
)
