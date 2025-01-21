'use client'

import React, { ComponentProps, useCallback, useMemo, useRef } from 'react'
import { tv } from 'tailwind-variants'

import { Base } from '../Base'
import { RadioButton } from '../RadioButton'

type Props = ComponentProps<typeof RadioButton> & {
  as?: string | React.ComponentType<any>
}

const radioButtonPanel = tv({
  base: [
    'smarthr-ui-RadioButtonPanel',
    'shr-border-shorthand shr-list-none shr-shadow-none',
    // なぜか :has が動作しないので重ねて書いている
    'has-[:focus-visible]:shr-focus-indicator [&:has(:focus-visible)]:shr-focus-indicator',
    '[&_.smarthr-ui-RadioButton-radioButton:focus-visible_+_span]:shr-shadow-none',
    '[&_.smarthr-ui-RadioButton-label]:shr-ms-0.75',
    'has-[:disabled]:shr-cursor-default has-[:disabled]:[&_.smarthr-ui-RadioButton-label]:shr-cursor-default',
  ],
  variants: {
    disabled: {
      false: 'shr-cursor-pointer [&_.smarthr-ui-RadioButton-label]:shr-cursor-pointer',
    },
  },
})

export const RadioButtonPanel: React.FC<Props> = ({ onClick, as, className, ...props }) => {
  const styles = useMemo(
    () => radioButtonPanel({ disabled: !!props.disabled, className }),
    [props.disabled, className],
  )
  const role = useMemo(
    () => (typeof as === 'string' && /^(div|span)$/.test(as) ? 'presentation' : undefined),
    [as],
  )

  // 外側の装飾を押しても内側のラジオボタンが押せるようにする
  const innerRef = useRef<HTMLInputElement>(null)
  const handleOuterClick = useCallback(() => {
    innerRef.current?.click()
  }, [])

  return (
    // eslint-disable-next-line smarthr/a11y-delegate-element-has-role-presentation
    <Base padding={1} role={role} onClick={handleOuterClick} as={as} className={styles}>
      <RadioButton {...props} ref={innerRef} />
    </Base>
  )
}
