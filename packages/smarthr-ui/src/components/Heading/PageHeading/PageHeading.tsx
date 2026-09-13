import { type PropsWithChildren, forwardRef, memo } from 'react'

import { IS_NEXT_JS } from '../../../libs/nextjs'

import { ActualHeading } from './ActualHeading'
import { AutoPageTitleHeading } from './client'

import type { TextProps } from '../../Text'
import type { ElementProps } from '../client'

export type BaseProps = PropsWithChildren<{
  /**
   * テキストのサイズ
   *
   * @default 'XL'
   */
  size?: Extract<TextProps['size'], 'XXL' | 'XL' | 'L'>
  /** 視覚的に非表示にするフラグ */
  visuallyHidden?: boolean
  /**
   * title要素の自動生成フラグ
   *
   * Next.js 環境ではこの値にかかわらずtitleは自動生成されません。metadataなどの方法を利用してください。
   */
  autoPageTitle?: boolean
  /** title要素のprefix */
  pageTitle?: string
  /** title要素のsuffix */
  pageTitleSuffix?: string
}>
export type Props = BaseProps & Omit<ElementProps, keyof BaseProps>

export const PageHeading = memo(
  forwardRef<HTMLHeadingElement, Props>(
    (
      {
        autoPageTitle = true,
        pageTitleSuffix = 'SmartHR（スマートHR）',
        pageTitle,
        size = 'XL',
        children,
        ...rest
      },
      ref,
    ) =>
      !IS_NEXT_JS && autoPageTitle ? (
        <AutoPageTitleHeading
          {...rest}
          outerRef={ref}
          pageTitleSuffix={pageTitleSuffix}
          pageTitle={pageTitle}
          size={size}
        >
          {children}
        </AutoPageTitleHeading>
      ) : (
        <ActualHeading {...rest} headingRef={ref} size={size}>
          {children}
        </ActualHeading>
      ),
  ),
)
