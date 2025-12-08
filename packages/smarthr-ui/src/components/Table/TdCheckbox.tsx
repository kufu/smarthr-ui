import { type ComponentProps, type PropsWithChildren, forwardRef, useMemo } from 'react'
import { tv } from 'tailwind-variants'

import { Checkbox, type Props as CheckboxProps } from '../Checkbox'
import { VisuallyHiddenText } from '../VisuallyHiddenText'

import { Td } from './Td'

type Props = PropsWithChildren<{
  /** 値を特定するための行 id */
  'aria-labelledby': string
}> &
  Pick<ComponentProps<typeof Td>, 'vAlign' | 'fixed'>

const classNameGenerator = tv({
  slots: {
    inner: [
      'shr-relative',
      'shr-flex shr-justify-center shr-px-1 shr-py-0.75',
      '[&:not(:has([disabled]))]:shr-cursor-pointer',
    ],
    wrapper: 'shr-w-min shr-p-0',
    checkbox: ['shr-leading-[0]', '[&>span]:shr-translate-y-[unset]'],
  },
})

export const TdCheckbox = forwardRef<HTMLInputElement, Omit<CheckboxProps, keyof Props> & Props>(
  ({ vAlign, fixed, children, className, ...rest }, ref) => {
    const classNames = useMemo(() => {
      const { wrapper, inner, checkbox } = classNameGenerator()

      return {
        wrapper: wrapper({ className }),
        inner: inner(),
        checkbox: checkbox(),
      }
    }, [className])

    return (
      // Td に必要な属性やイベントは不要
      <Td vAlign={vAlign} fixed={fixed} className={classNames.wrapper}>
        <label className={classNames.inner}>
          <Checkbox {...rest} ref={ref} className={classNames.checkbox} />
          {children && <VisuallyHiddenText>{children}</VisuallyHiddenText>}
        </label>
      </Td>
    )
  },
)
