'use client'

import React, { type ComponentProps, useCallback, useMemo, useRef } from 'react'
import { tv } from 'tailwind-variants'

import { Base } from '../Base'
import { RadioButton } from '../RadioButton'

type Props = ComponentProps<typeof RadioButton> & {
  as?: string | React.ComponentType<any>
}

const NONE_ROLE_TAG_REGEX = /^(div|span)$/

const classNameGenerator = tv({
  base: [
    'smarthr-ui-RadioButtonPanel',
    'shr-border-shorthand shr-list-none shr-shadow-none',
    // なぜか :has が動作しないので重ねて書いている
    'has-[:focus-visible]:shr-focus-indicator [&:has(:focus-visible)]:shr-focus-indicator',
    '[&_.smarthr-ui-RadioButton-radioButton:focus-visible_+_span]:shr-shadow-none',
    '[&_.smarthr-ui-RadioButton-label]:shr-ms-0.75',
    'shr-cursor-pointer has-[:not(:disabled)]:[&_.smarthr-ui-RadioButton-label]:shr-cursor-pointer',
    'has-[:disabled]:shr-cursor-default has-[:disabled]:[&_.smarthr-ui-RadioButton-label]:shr-cursor-default',
  ],
})

export const RadioButtonPanel: React.FC<Props> = ({ onClick, as, className, ...props }) => {
  const actualClassName = useMemo(() => classNameGenerator({ className }), [className])
  const role = useMemo(
    () => (typeof as === 'string' && NONE_ROLE_TAG_REGEX.test(as) ? 'presentation' : undefined),
    [as],
  )

  // 外側の装飾を押しても内側のラジオボタンが押せるようにする
  const innerRef = useRef<HTMLInputElement>(null)
  const handleOuterClick = useCallback(() => {
    innerRef.current?.click()
  }, [])

  return (
    // eslint-disable-next-line smarthr/a11y-delegate-element-has-role-presentation
    <Base padding={1} role={role} onClick={handleOuterClick} as={as} className={actualClassName}>
      <RadioButton {...props} ref={innerRef} />
    </Base>
  )
}
