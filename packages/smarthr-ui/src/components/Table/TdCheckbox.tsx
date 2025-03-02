import React, { ComponentProps, PropsWithChildren, forwardRef, useMemo } from 'react'
import { tv } from 'tailwind-variants'

import { CheckBox, Props as CheckBoxProps } from '../CheckBox'
import { VisuallyHiddenText } from '../VisuallyHiddenText'

import { Td } from './Td'

type Props = PropsWithChildren<{
  /** 値を特定するための行 id */
  'aria-labelledby': string
}> &
  Pick<ComponentProps<typeof Td>, 'vAlign'>

const tdCheckbox = tv({
  slots: {
    inner: [
      'shr-flex shr-justify-center shr-py-0.75 shr-px-1',
      '[&:not(:has([disabled]))]:shr-cursor-pointer',
    ],
    wrapper: 'shr-p-0 shr-w-[theme(fontSize.base)]',
    checkbox: ['shr-leading-[0]', '[&>span]:shr-translate-y-[unset]'],
  },
})

export const TdCheckbox = forwardRef<HTMLInputElement, Omit<CheckBoxProps, keyof Props> & Props>(
  ({ vAlign, children, className, ...rest }, ref) => {
    const classNames = useMemo(() => {
      const { wrapper, inner, checkbox } = tdCheckbox()

      return {
        wrapper: wrapper({ className }),
        inner: inner(),
        checkbox: checkbox(),
      }
    }, [className])

    return (
      // Td に必要な属性やイベントは不要
      <Td vAlign={vAlign} className={classNames.wrapper}>
        <label className={classNames.inner}>
          <CheckBox {...rest} ref={ref} className={classNames.checkbox} />
          {children && <VisuallyHiddenText>{children}</VisuallyHiddenText>}
        </label>
      </Td>
    )
  },
)
