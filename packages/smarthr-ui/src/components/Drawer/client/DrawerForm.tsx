'use client'

import { type FC, type FormEvent, useContext, useMemo } from 'react'
import { tv } from 'tailwind-variants'

import { useLatest } from '../../../hooks/useLatest'

import { DrawerContext } from './DrawerContext'

import type { ExtendElementPropsWithRef } from '../../../types'

type Props = ExtendElementPropsWithRef<
  'form',
  {
    /** 送信時。閉じるには渡された close を呼ぶ */
    onSubmit: (e: FormEvent<HTMLFormElement>, helpers: { close: () => void }) => void
  }
>

const classNameGenerator = tv({
  base: 'smarthr-ui-Drawer-form shr-contents',
})

export const DrawerForm: FC<Props> = ({ onSubmit, className, ...rest }) => {
  const { close, getIsOpen } = useContext(DrawerContext)
  const latest = useLatest({ onSubmit })

  const handleSubmit = useMemo(
    () => (e: FormEvent<HTMLFormElement>) => {
      e.preventDefault()
      // HINT: stopPropagation を省くと、ポータル越しに親の form まで submit が伝わる
      e.stopPropagation()

      if (getIsOpen()) {
        latest.onSubmit(e, { close })
      }
    },
    [close, getIsOpen, latest],
  )
  const actualClassName = useMemo(() => classNameGenerator({ className }), [className])

  return <form {...rest} className={actualClassName} onSubmit={handleSubmit} />
}
