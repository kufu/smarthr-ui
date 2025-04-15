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
  description?: ReactNode
}

const NONE_ROLE_TAG_REGEX = /^(div|span)$/

const classNameGenerator = tv({
  slots: {
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
    description: 'shr-ms-[1.75em] shr-mt-0.5',
  },
  variants: {
    hasDescription: {
      true: 'shr-flex shr-flex-col',
      false: '',
    },
  },
})

export const RadioButtonPanel: FC<Props> = ({
  onClick,
  as,
  className,
  description,
  'aria-describedby': ariaDescribedbyProp,
  ...props
}) => {
  const classNames = useMemo(() => {
    const { base, description: descriptionStyle } = classNameGenerator({
      className,
      hasDescription: !!description,
    })
    return { base: base(), description: descriptionStyle() }
  }, [className, description])
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
  const ariaDescribedby = useMemo(
    () => [description && descriptionId, ariaDescribedbyProp].filter(Boolean).join(' '),
    [description, descriptionId, ariaDescribedbyProp],
  )

  return (
    // eslint-disable-next-line smarthr/a11y-delegate-element-has-role-presentation
    <Base padding={1} role={role} onClick={handleOuterClick} as={as} className={classNames.base}>
      <RadioButton {...props} ref={innerRef} aria-describedby={ariaDescribedby} />
      {description && (
        <span id={descriptionId} className={classNames.description}>
          {description}
        </span>
      )}
    </Base>
  )
}
