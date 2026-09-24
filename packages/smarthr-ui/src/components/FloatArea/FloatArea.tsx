import { type ComponentPropsWithoutRef, type FC, type ReactNode, useMemo } from 'react'
import { tv } from 'tailwind-variants'

import { Cluster, Stack } from '../Layout'
import { ResponseMessage } from '../ResponseMessage'

import { FloatAreaPanel } from './client'

import type { ResponseStatusWithoutProcessing } from '../../hooks/useResponseStatus'
import type { AbstractSize, CharRelativeSize } from '../../themes'

const classNameGenerator = tv({
  base: [
    'smarthr-ui-FloatArea shr-sticky shr-z-fixed-menu -shr-mx-0.5',
    'shr-bottom-[--shr-float-area-bottom]',
    // HINT: stickyの基準がviewportの場合のみ、safe areaの分だけ下端から離す
    'data-[sticky-to-viewport]:shr-bottom-[calc(var(--shr-float-area-bottom)+env(safe-area-inset-bottom))]',
  ],
  variants: {
    bottom: {
      0: '[--shr-float-area-bottom:0px]',
      0.25: '[--shr-float-area-bottom:theme(spacing[0.25])]',
      0.5: '[--shr-float-area-bottom:theme(spacing[0.5])]',
      0.75: '[--shr-float-area-bottom:theme(spacing[0.75])]',
      1: '[--shr-float-area-bottom:theme(spacing[1])]',
      1.25: '[--shr-float-area-bottom:theme(spacing[1.25])]',
      1.5: '[--shr-float-area-bottom:theme(spacing[1.5])]',
      2: '[--shr-float-area-bottom:theme(spacing[2])]',
      2.5: '[--shr-float-area-bottom:theme(spacing[2.5])]',
      3: '[--shr-float-area-bottom:theme(spacing[3])]',
      3.5: '[--shr-float-area-bottom:theme(spacing[3.5])]',
      4: '[--shr-float-area-bottom:theme(spacing[4])]',
      8: '[--shr-float-area-bottom:theme(spacing[8])]',
      X3S: '[--shr-float-area-bottom:theme(spacing[0.25])]',
      XXS: '[--shr-float-area-bottom:theme(spacing[0.5])]',
      XS: '[--shr-float-area-bottom:theme(spacing[1])]',
      S: '[--shr-float-area-bottom:theme(spacing[1.5])]',
      M: '[--shr-float-area-bottom:theme(spacing[2])]',
      L: '[--shr-float-area-bottom:theme(spacing[2.5])]',
      XL: '[--shr-float-area-bottom:theme(spacing[3])]',
      XXL: '[--shr-float-area-bottom:theme(spacing[3.5])]',
      X3L: '[--shr-float-area-bottom:theme(spacing[4])]',
    } as { [key in CharRelativeSize | AbstractSize]: string },
  },
})

type BaseProps = {
  /** 表示する `Button` または `AnchorButton` コンポーネント */
  primaryButton: ReactNode
  /** 表示する `Button` または `AnchorButton` コンポーネント */
  secondaryButton?: ReactNode
  /** tertiary 領域に表示するボタン */
  tertiaryButton?: ReactNode
  /** 操作に対するフィードバックメッセージ */
  responseStatus?: ResponseStatusWithoutProcessing
  /** コンポーネントの下端から、包含ブロックの下端までの間隔（基準フォントサイズの相対値または抽象値） */
  bottom?: CharRelativeSize | AbstractSize
  /** コンポーネントの `z-index` 値 */
  zIndex?: number
}
type Props = BaseProps & Omit<ComponentPropsWithoutRef<'div'>, keyof BaseProps>

export const FloatArea: FC<Props> = ({
  primaryButton,
  secondaryButton,
  tertiaryButton,
  responseStatus,
  bottom,
  zIndex,
  style,
  className,
  ...rest
}) => {
  const actualClassName = useMemo(
    () => classNameGenerator({ bottom: bottom ?? 1.5, className }),
    [bottom, className],
  )

  return (
    <FloatAreaPanel
      {...rest}
      layer={3}
      padding={1}
      className={actualClassName}
      style={{ ...style, zIndex }}
    >
      <Stack gap={0.5}>
        <Cluster>
          {tertiaryButton}
          <Cluster gap={1} className="shr-ms-auto">
            {secondaryButton}
            {primaryButton}
          </Cluster>
        </Cluster>
        {responseStatus && (
          <p className="shr-ms-auto">
            <ResponseMessage status={responseStatus.status}>{responseStatus.text}</ResponseMessage>
          </p>
        )}
      </Stack>
    </FloatAreaPanel>
  )
}
