import { type ComponentProps, forwardRef, useMemo } from 'react'
import { tv } from 'tailwind-variants'

import { type DecoratorsType, useDecorators } from '../../hooks/useDecorators'
import { Balloon } from '../Balloon'
import { CheckBox, type Props as CheckBoxProps } from '../CheckBox'

import { Th } from './Th'

type Props = {
  // HINT: checkColumnName は aria-label属性に設定されるため、型をstringのみに絞ります
  decorators?: DecoratorsType<'checkAllInvisibleLabel'> & {
    checkColumnName?: (text: string) => string
  }
} & Pick<ComponentProps<typeof Th>, 'vAlign'>

const DECORATOR_DEFAULT_TEXTS = {
  checkAllInvisibleLabel: 'すべての項目を選択/解除',
  checkColumnName: '選択',
} as const
type DecoratorKeyTypes = keyof typeof DECORATOR_DEFAULT_TEXTS

const classNameGenerator = tv({
  slots: {
    inner: [
      'shr-group/label',
      'shr-relative shr-flex shr-justify-center shr-py-0.75 shr-px-1',
      '[&:not(:has([disabled]))]:shr-cursor-pointer',
    ],
    wrapper: 'shr-p-0 shr-w-[theme(fontSize.base)]',
    checkbox: ['shr-leading-[0]', '[&>span]:shr-translate-y-[unset]'],
    balloon: [
      // 位置はセルの真ん中(50%)+checkboxの幅の半分(8px)+outlineの幅(4px)+Balloonの矢印の幅(5px), sr-onlyで隠す
      'shr-absolute shr-left-[calc(50%+(theme(fontSize.base)/2)+4px+5px)] shr-sr-only',
      // labelの中の要素に hover or focus-visible がある時のスタイル。shr-absoluteはshr-not-sr-onlyのpositionをabsoluteに上書きしている
      'group-has-[:hover,:focus-visible]/label:shr-not-sr-only group-has-[:hover,:focus-visible]/label:shr-absolute group-has-[:hover,:focus-visible]/label:shr-whitespace-nowrap',
    ],
  },
})

export const ThCheckbox = forwardRef<HTMLInputElement, CheckBoxProps & Props>(
  ({ vAlign, decorators, className, ...others }, ref) => {
    const classNames = useMemo(() => {
      const { wrapper, inner, balloon, checkbox } = classNameGenerator()

      return {
        wrapper: wrapper({ className }),
        inner: inner(),
        balloon: balloon(),
        checkbox: checkbox(),
      }
    }, [className])

    const decorated = useDecorators<DecoratorKeyTypes>(DECORATOR_DEFAULT_TEXTS, decorators)

    return (
      // Th に必要な属性やイベントは不要
      <Th
        vAlign={vAlign}
        className={classNames.wrapper}
        aria-label={decorated.checkColumnName as string}
      >
        {/* eslint-disable-next-line jsx-a11y/label-has-associated-control */}
        <label className={classNames.inner}>
          <Balloon as="span" horizontal="left" vertical="middle" className={classNames.balloon}>
            <span className="shr-p-0.5 shr-block">{decorated.checkAllInvisibleLabel}</span>
          </Balloon>
          <CheckBox {...others} ref={ref} className={classNames.checkbox} />
        </label>
      </Th>
    )
  },
)
