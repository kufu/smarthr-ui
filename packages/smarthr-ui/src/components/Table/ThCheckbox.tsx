'use client'

import { type ComponentProps, forwardRef, useMemo } from 'react'
import { tv } from 'tailwind-variants'

import { type DecoratorsType, useDecorators } from '../../hooks/useDecorators'
import { useIntl } from '../../intl'
import { Balloon } from '../Balloon'
import { Checkbox, type Props as CheckboxProps } from '../Checkbox'

import { Th } from './Th'

type Props = {
  // HINT: checkColumnName は aria-label属性に設定されるため、型をstringのみに絞ります
  decorators?: DecoratorsType<'checkAllInvisibleLabel'> & {
    checkColumnName?: (text: string) => string
  }
} & Pick<ComponentProps<typeof Th>, 'vAlign' | 'fixed'>

const classNameGenerator = tv({
  slots: {
    inner: [
      'shr-group/label',
      'shr-relative shr-flex shr-justify-center shr-px-1 shr-py-0.75',
      '[&:not(:has([disabled]))]:shr-cursor-pointer',
    ],
    wrapper: 'shr-w-[theme(fontSize.base)] shr-p-0',
    checkbox: ['shr-leading-[0]', '[&>span]:shr-translate-y-[unset]'],
    balloon: [
      // 位置はセルの真ん中(50%)+checkboxの幅の半分(8px)+outlineの幅(4px)+Balloonの矢印の幅(5px), sr-onlyで隠す
      'shr-sr-only shr-absolute shr-left-[calc(50%+(theme(fontSize.base)/2)+4px+5px)]',
      // labelの中の要素に hover or focus-visible がある時のスタイル。shr-absoluteはshr-not-sr-onlyのpositionをabsoluteに上書きしている
      'group-has-[:hover,:focus-visible]/label:shr-not-sr-only group-has-[:hover,:focus-visible]/label:shr-absolute group-has-[:hover,:focus-visible]/label:shr-whitespace-nowrap',
    ],
  },
})

export const ThCheckbox = forwardRef<HTMLInputElement, CheckboxProps & Props>(
  ({ vAlign, fixed, decorators, className, ...others }, ref) => {
    const { localize } = useIntl()

    const decoratorDefaultTexts = useMemo(
      () => ({
        checkAllInvisibleLabel: localize({
          id: 'smarthr-ui/ThCheckbox/checkAllInvisibleLabel',
          defaultText: 'すべての項目を選択/解除',
        }),
        checkColumnName: localize({
          id: 'smarthr-ui/ThCheckbox/checkColumnName',
          defaultText: '選択',
        }),
      }),
      [localize],
    )

    const decorated = useDecorators<'checkAllInvisibleLabel' | 'checkColumnName'>(
      decoratorDefaultTexts,
      decorators,
    )

    const classNames = useMemo(() => {
      const { wrapper, inner, balloon, checkbox } = classNameGenerator()

      return {
        wrapper: wrapper({ className }),
        inner: inner(),
        balloon: balloon(),
        checkbox: checkbox(),
      }
    }, [className])

    return (
      // Th に必要な属性やイベントは不要
      <Th
        vAlign={vAlign}
        fixed={fixed}
        className={classNames.wrapper}
        aria-label={decorated.checkColumnName as string}
      >
        {/* eslint-disable-next-line jsx-a11y/label-has-associated-control */}
        <label className={classNames.inner}>
          <Balloon as="span" horizontal="left" vertical="middle" className={classNames.balloon}>
            <span className="shr-block shr-p-0.5">{decorated.checkAllInvisibleLabel}</span>
          </Balloon>
          <Checkbox {...others} ref={ref} className={classNames.checkbox} />
        </label>
      </Th>
    )
  },
)
