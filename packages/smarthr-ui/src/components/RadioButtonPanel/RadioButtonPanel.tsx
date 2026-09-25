import {
  type ComponentProps,
  type ComponentType,
  type FC,
  type ReactNode,
  useId,
  useMemo,
} from 'react'
import { tv } from 'tailwind-variants'

import { RadioButton } from '../RadioButton'

import { ClickablePanel } from './client'

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
      '[&_.smarthr-ui-RadioButton-radioButton:focus-visible_+_span]:shr-focus-indicator-none',
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

export const RadioButtonPanel: FC<Props> = ({ children, className, ...rest }) => {
  const hasDescription = !!children

  const classNames = useMemo(() => {
    const { base, description, radio } = classNameGenerator({
      className,
      hasDescription,
    })

    return { base: base(), description: description(), radio: radio() }
  }, [hasDescription, className])

  return hasDescription ? (
    <DescriptionRadioButtonPanel {...rest} classNames={classNames}>
      {children}
    </DescriptionRadioButtonPanel>
  ) : (
    <ActualRadioButtonPanel {...rest} classNames={classNames} />
  )
}

type LowerProps = Omit<Props, 'className'> & {
  classNames: {
    base: string
    description: string
    radio: string
  }
}

const DescriptionRadioButtonPanel: FC<LowerProps> = ({
  'aria-describedby': ariaDescribedby,
  classNames,
  children,
  ...rest
}) => {
  const descriptionId = useId()

  return (
    <ActualRadioButtonPanel
      {...rest}
      classNames={classNames}
      aria-describedby={`${descriptionId}${ariaDescribedby ? ` ${ariaDescribedby}` : ''}`}
    >
      <div id={descriptionId} className={classNames.description}>
        {children}
      </div>
    </ActualRadioButtonPanel>
  )
}

const ActualRadioButtonPanel: FC<LowerProps> = ({ as, classNames, children, label, ...rest }) => (
  <ClickablePanel as={as} className={classNames.base}>
    <RadioButton {...rest} className={classNames.radio}>
      {label}
    </RadioButton>
    {children}
  </ClickablePanel>
)
