import {
  type ComponentPropsWithoutRef,
  type ElementType,
  type FC,
  type MouseEvent,
  type PropsWithoutRef,
  type ReactNode,
  type Ref,
  forwardRef,
  memo,
  useMemo,
} from 'react'
import { type VariantProps, tv } from 'tailwind-variants'

import { OpenInNewTabIcon } from '../Icon'

import type { ElementRef, ElementRefProps } from '../../types'

type ElementProps<T extends ElementType> = Omit<
  ComponentPropsWithoutRef<T>,
  (keyof Props<T> & ElementRefProps<T>) | 'color'
>

type Props<T extends ElementType> = VariantProps<typeof classNameGenerator> & {
  /** リンクをクリックした時に発火するコールバック関数 */
  onClick?: (e: MouseEvent) => void
  /** テキストの前に表示するアイコン */
  prefix?: ReactNode
  /** テキストの後ろに表示するアイコン */
  suffix?: ReactNode
  /** TextLinkを利用しつつnext/linkなどと併用する場合に指定する */
  elementAs?: T
}

type TextLinkComponent = <T extends ElementType = 'a'>(
  props: Props<T> & ElementProps<T> & ElementRefProps<T>,
) => ReturnType<FC>

const classNameGenerator = tv({
  slots: {
    anchor: [
      'shr-text-link shr-no-underline shr-shadow-underline',
      'forced-colors:shr-underline',
      '[&:not([href])]:shr-shadow-none [&:not([href])]:forced-colors:shr-no-underline',
      '[.smarthr-ui-Th_&]:shr-text-link-darken',
    ],
    prefixWrapper: 'shr-me-0.25 shr-align-middle',
    suffixWrapper: 'shr-ms-0.25 shr-align-middle',
  },
  variants: {
    size: {
      XS: {
        anchor: 'shr-text-xs',
      },
      S: {
        anchor: 'shr-text-sm',
      },
      M: {
        anchor: 'shr-text-base',
      },
    },
  },
})
const ActualTextLink: TextLinkComponent = forwardRef(
  <T extends ElementType = 'a'>(
    {
      elementAs,
      href,
      target,
      rel,
      onClick,
      children,
      prefix,
      suffix,
      className,
      size,
      ...rest
    }: PropsWithoutRef<Props<T>> & ElementProps<T>,
    ref: Ref<ElementRef<T>>,
  ) => {
    const Anchor = elementAs || 'a'
    // target="_blank" だが OpenInNewTabIcon を表示したくない場合 suffix に null を指定すれば表示しないようにしている
    const actualSuffix =
      target === '_blank' && !prefix && suffix === undefined ? <OpenInNewTabIcon /> : suffix
    const classNames = useMemo(() => {
      const { anchor, prefixWrapper, suffixWrapper } = classNameGenerator()
      return {
        anchor: anchor({ size, className }),
        prefixWrapper: prefixWrapper(),
        suffixWrapper: suffixWrapper(),
      }
    }, [size, className])

    return (
      <Anchor
        {...rest}
        ref={ref}
        // HINT: a要素でhrefが存在しない === button[disabled]のように無効化されていることを表す
        // そのためhrefが存在せず、かつonClickが設定されている場合、hrefを擬似的に設定することで
        // disabledではない状態にする (TODO: a11y的にはhrefをoptionalではなく必須属性としたい)
        href={href ? href : onClick ? '' : undefined}
        target={target}
        rel={rel === undefined && target === '_blank' ? 'noopener noreferrer' : rel}
        // HINT: このコンポーネントは `use client` をつけなくても動作する状態にしたい
        //  - TextLinkにonClickが設定されるパターンは少ない
        //  - elementAsが設定されるパターンはさらに少ないため基本的にa要素になっている
        //  - useLatestを利用すると内部でuseRefを利用しているためclient componentが強制される
        // 以上からmemo化せずに直接設定しています。
        // 今後の修正でclient componentになった場合はmemo化を検討する
        onClick={
          onClick
            ? (e: MouseEvent) => {
                if (!href) {
                  e.preventDefault()
                }
                onClick(e)
              }
            : undefined
        }
        className={classNames.anchor}
      >
        {prefix && <span className={classNames.prefixWrapper}>{prefix}</span>}
        {children}
        {actualSuffix && <span className={classNames.suffixWrapper}>{actualSuffix}</span>}
      </Anchor>
    )
  },
)

export const TextLink = memo(ActualTextLink) as typeof ActualTextLink
