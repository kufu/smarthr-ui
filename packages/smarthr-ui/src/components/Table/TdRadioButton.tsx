import { type ComponentProps, type PropsWithChildren, forwardRef, useMemo } from 'react'
import { tv } from 'tailwind-variants'

import { RadioButton } from '../RadioButton'
import { VisuallyHiddenText } from '../VisuallyHiddenText'

import { Td } from './Td'

type Props = PropsWithChildren<{
  /** 値を特定するための行 id */
  'aria-labelledby': string
}> &
  ComponentProps<typeof RadioButton> &
  Pick<ComponentProps<typeof Td>, 'vAlign'>

const classNameGenerator = tv({
  slots: {
    inner: [
      'shr-flex shr-justify-center shr-px-1 shr-py-0.75',
      '[&:not(:has([disabled]))]:shr-cursor-pointer',
    ],
    wrapper: 'shr-p-0',
    radio: ['shr-leading-[0]', '[&>span]:shr-translate-y-[unset]'],
  },
})

export const TdRadioButton = forwardRef<HTMLInputElement, Props>(
  ({ vAlign, children, className, ...rest }, ref) => {
    const classNames = useMemo(() => {
      const { wrapper, inner, radio } = classNameGenerator()

      return {
        wrapper: wrapper({ className }),
        inner: inner(),
        radio: radio(),
      }
    }, [className])

    return (
      // Td に必要な属性やイベントは不要
      <Td vAlign={vAlign} className={classNames.wrapper}>
        <label className={classNames.inner}>
          <RadioButton {...rest} ref={ref} className={classNames.radio} />
          {children && <VisuallyHiddenText>{children}</VisuallyHiddenText>}
        </label>
      </Td>
    )
  },
)
