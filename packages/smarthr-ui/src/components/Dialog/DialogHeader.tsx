'use client'

import { type FC, type PropsWithChildren, useMemo } from 'react'
import { tv } from 'tailwind-variants'

import { Cluster } from '../Layout'

const classNameGenerator = tv({
  base: ['smarthr-ui-Dialog-titleArea', 'shr-border-b-shorthand shr-flex-none shr-px-1.5 shr-py-1'],
  variants: {
    mobile: {
      true: 'shr-p-1',
      false: '',
    },
    mobileType: {
      sheet:
        '[&>.smarthr-ui-Dialog-headingWrapper]:shr-min-w-0 [&>.smarthr-ui-Dialog-headingWrapper]:shr-flex-1',
    },
  },
})

type Props = PropsWithChildren<{
  className?: string
  /**
   * モバイル時の表示形式（'sheet' で見出しと閉じるボタンを横並びにする）
   */
  mobileType?: 'sheet'
  mobile: boolean
}>

export const DialogHeader: FC<Props> = ({ children, className, mobileType, mobile }) => {
  const actualClassName = useMemo(
    () => classNameGenerator({ mobile, mobileType, className }),
    [mobileType, mobile, className],
  )

  return (
    <Cluster justify="space-between" align="center" className={actualClassName}>
      {children}
    </Cluster>
  )
}
