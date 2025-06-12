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
import { Cluster } from '../Layout'
import { RadioButton } from '../RadioButton'

type Props = ComponentProps<typeof RadioButton> & {
  as?: string | ComponentType<any>
  label: ReactNode
  labelSuffix?: ReactNode
}

const NONE_ROLE_TAG_REGEX = /^(div|span)$/

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
  labelSuffix,
  'aria-describedby': ariaDescribedby,
  ...props
}) => {
  const classNames = useMemo(() => {
    const { base, description, radio } = classNameGenerator({
      className,
      hasDescription: !!children,
    })
    return { base: base(), description: description(), radio: radio() }
  }, [className, children])
  const role = useMemo(
    () => (typeof as === 'string' && NONE_ROLE_TAG_REGEX.test(as) ? 'presentation' : undefined),
    [as],
  )

  // 外側の装飾を押しても内側のラジオボタンが押せるようにする
  const innerRef = useRef<HTMLInputElement>(null)
  const handleOuterClick = useCallback(() => {
    innerRef.current?.click()
  }, [])

  const descriptionId = useId()

  return (
    // eslint-disable-next-line smarthr/a11y-delegate-element-has-role-presentation
    <Base padding={1} role={role} onClick={handleOuterClick} as={as} className={classNames.base}>
      <RadioButton
        {...props}
        ref={innerRef}
        aria-describedby={`${descriptionId} ${ariaDescribedby ?? ''}`}
        className={classNames.radio}
      >
        <Cluster align="center" as="span">
          {label}
          {labelSuffix}
        </Cluster>
      </RadioButton>
      {children && (
        <div id={descriptionId} className={classNames.description}>
          {children}
        </div>
      )}
    </Base>
  )
}
