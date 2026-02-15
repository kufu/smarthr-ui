'use client'

import {
  type ComponentProps,
  type ComponentType,
  type FC,
  type ReactNode,
  useCallback,
  useId,
  useMemo,
  useRef,
} from 'react'
import { tv } from 'tailwind-variants'

import { Base } from '../Base'
import { RadioButton } from '../RadioButton'

type Props = ComponentProps<typeof RadioButton> & {
  as?: string | ComponentType<any>
  label: ReactNode
}

const classNameGenerator = tv({
  slots: {
    base: [
      'smarthr-ui-RadioButtonPanel',
      'shr-border-shorthand shr-cursor-pointer shr-list-none shr-shadow-none',
      'has-[:disabled]:shr-cursor-default',
      // FIX: なぜか storybook 上で :has が動作しないので重ねて書いている
      'has-[:focus-visible]:shr-focus-indicator [&:has(:focus-visible)]:shr-focus-indicator',
      '[&:has(:disabled)]:shr-text-disabled has-[:disabled]:[&_.smarthr-ui-RadioButtonPanel-description]:shr-text-disabled',
    ],
    radio: [
      '[&_.smarthr-ui-RadioButton-radioButton:focus-visible_+_span]:shr-shadow-none',
      '[&_.smarthr-ui-RadioButton-label]:shr-ms-0.75',
    ],
    // RadioButtonPanel で指定している shr-ms-0.75 + RadioButton のボタンの shr-w-em を足して shr-ms-[1.75em] にしている
    description: ['smarthr-ui-RadioButtonPanel-description', 'shr-ms-[1.75em] shr-mt-0.5'],
  },
  variants: {
    hasDescription: {
      true: {
        base: 'shr-flex shr-flex-col',
        radio: 'shr-font-bold',
      },
    },
  },
})

export const RadioButtonPanel: FC<Props> = ({
  onClick,
  as,
  className,
  children,
  label,
  'aria-describedby': ariaDescribedby,
  ...rest
}) => {
  const hasDescription = !!children
  const classNames = useMemo(() => {
    const { base, description, radio } = classNameGenerator({
      className,
      hasDescription,
    })

    return { base: base(), description: description(), radio: radio() }
  }, [className, hasDescription])

  // 外側の装飾を押しても内側のラジオボタンが押せるようにする
  const innerRef = useRef<HTMLInputElement>(null)
  const onDelegateClick = useCallback(() => {
    innerRef.current?.click()
  }, [])

  const descriptionId = useId()

  return (
    <Base padding={1} onClick={onDelegateClick} as={as} className={classNames.base}>
      <RadioButton
        {...rest}
        ref={innerRef}
        aria-describedby={`${descriptionId}${ariaDescribedby ? ` ${ariaDescribedby}` : ''}`}
        className={classNames.radio}
      >
        {label}
      </RadioButton>
      {children && (
        <div id={descriptionId} className={classNames.description}>
          {children}
        </div>
      )}
    </Base>
  )
}
