import { type ComponentPropsWithRef, type FC, useMemo } from 'react'
import { tv } from 'tailwind-variants'

import { Checkbox } from '../Checkbox'
import { VisuallyHiddenText } from '../VisuallyHiddenText'

import { Td } from './Td'

import type { SHRComponentPropsWithRef } from '../../types'

type Props = SHRComponentPropsWithRef<
  typeof Checkbox,
  Pick<ComponentPropsWithRef<typeof Td>, 'vAlign' | 'fixed' | 'rowSpan' | 'colSpan'> & {
    /** Checkboxのaccessible nameとして設定するテキストを参照するためのid属性値。同じ親Tr配下のTdかTh、もしくはその子孫要素のidを指定する。複数要素のテキストを指定する場合は空白区切りでidをつなぐ */
    'aria-labelledby': string
  }
>

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

export const TdCheckbox: FC<Props> = ({
  vAlign,
  fixed,
  children,
  className,
  rowSpan,
  colSpan,
  ...rest
}) => {
  const classNames = useMemo(() => {
    const { wrapper, inner, checkbox } = classNameGenerator()

    return {
      wrapper: wrapper({ className }),
      inner: inner(),
      checkbox: checkbox(),
    }
  }, [className])

  return (
    <Td
      vAlign={vAlign}
      fixed={fixed}
      rowSpan={rowSpan}
      colSpan={colSpan}
      className={classNames.wrapper}
    >
      <label className={classNames.inner}>
        {/* eslint-disable-next-line smarthr/a11y-prohibit-checkbox-or-radio-in-table-cell */}
        <Checkbox {...rest} className={classNames.checkbox} />
        {children && <VisuallyHiddenText>{children}</VisuallyHiddenText>}
      </label>
    </Td>
  )
}
