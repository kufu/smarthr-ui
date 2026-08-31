import { type ComponentPropsWithoutRef, type FC, type ReactNode, useMemo } from 'react'
import { tv } from 'tailwind-variants'

import { Cluster, Stack } from '../Layout'
import { Panel } from '../Panel'
import { ResponseMessage } from '../ResponseMessage'

import type { ResponseStatusWithoutProcessing } from '../../hooks/useResponseStatus'
import type { AbstractSize, CharRelativeSize } from '../../themes'

const classNameGenerator = tv({
  base: 'smarthr-ui-FloatArea shr-sticky shr-z-fixed-menu -shr-mx-0.5',
  variants: {
    bottom: {
      0: 'shr-bottom-0',
      0.25: 'shr-bottom-0.25',
      0.5: 'shr-bottom-0.5',
      0.75: 'shr-bottom-0.75',
      1: 'shr-bottom-1',
      1.25: 'shr-bottom-1.25',
      1.5: 'shr-bottom-1.5',
      2: 'shr-bottom-2',
      2.5: 'shr-bottom-2.5',
      3: 'shr-bottom-3',
      3.5: 'shr-bottom-3.5',
      4: 'shr-bottom-4',
      8: 'shr-bottom-8',
      X3S: 'shr-bottom-0.25',
      XXS: 'shr-bottom-0.5',
      XS: 'shr-bottom-1',
      S: 'shr-bottom-1.5',
      M: 'shr-bottom-2',
      L: 'shr-bottom-2.5',
      XL: 'shr-bottom-3',
      XXL: 'shr-bottom-3.5',
      X3L: 'shr-bottom-4',
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
    <Panel {...rest} layer={3} padding={1} className={actualClassName} style={{ ...style, zIndex }}>
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
    </Panel>
  )
}
