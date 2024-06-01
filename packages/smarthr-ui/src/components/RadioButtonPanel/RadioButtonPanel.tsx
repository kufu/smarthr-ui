import React, { ComponentProps, useMemo, useRef } from 'react'
import { tv } from 'tailwind-variants'

import { Base } from '../Base'
import { RadioButton } from '../RadioButton'

type Props = ComponentProps<typeof RadioButton> & {
  as?: string | React.ComponentType<any>
}

const MEANLESS_TAG_NAMES = ['div', 'span']

const radioButtonPanel = tv({
  base: [
    'smarthr-ui-RadioButtonPanel',
    'shr-border-shorthand shr-list-none',
    // なぜか focus-indicator が機能しないので box-shadow で代用
    '[&:has(:focus-visible)]:shr-shadow-outline',
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
    [className, props.disabled],
  )

  // 外側の装飾を押しても内側のラジオボタンが押せるようにする
  const innerRef = useRef<HTMLInputElement>(null)
  const handleOuterClick = () => {
    innerRef.current?.click()
  }

  return (
    // eslint-disable-next-line smarthr/a11y-delegate-element-has-role-presentation
    <Base
      padding={1}
      layer={0}
      role={MEANLESS_TAG_NAMES.includes(`${as || ''}`) ? 'presentation' : undefined}
      onClick={handleOuterClick}
      as={as}
      className={styles}
    >
      {/* eslint-disable-next-line smarthr/a11y-input-has-name-attribute */}
      <RadioButton {...props} ref={innerRef} />
    </Base>
  )
}
