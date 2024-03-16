import React, { FC, HTMLAttributes, ReactNode, useMemo } from 'react'
import { tv } from 'tailwind-variants'

import { AbstractSize, CharRelativeSize } from '../../themes/createSpacing'
import { Gap, ResponseMessageType } from '../../types'
import { Base } from '../Base'
import { Cluster } from '../Layout'
import { ResponseMessage } from '../ResponseMessage'

const floatArea = tv({
  base: 'smarthr-ui-FloatArea',
  variants: {
    fixed: {
      true: 'shr-fixed',
      false: 'shr-sticky',
    },
    top: {
      0: 'shr-top-0',
      0.25: 'shr-top-0.25',
      0.5: 'shr-top-0.5',
      0.75: 'shr-top-0.75',
      1: 'shr-top-1',
      1.25: 'shr-top-1.25',
      1.5: 'shr-top-1.5',
      2: 'shr-top-2',
      2.5: 'shr-top-2.5',
      3: 'shr-top-3',
      3.5: 'shr-top-3.5',
      4: 'shr-top-4',
      8: 'shr-top-8',
      X3S: 'shr-top-0.25',
      XXS: 'shr-top-0.5',
      XS: 'shr-top-1',
      S: 'shr-top-1.5',
      M: 'shr-top-2',
      L: 'shr-top-2.5',
      XL: 'shr-top-3',
      XXL: 'shr-top-3.5',
      X3L: 'shr-top-4',
    } as { [key in Gap]: string },
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
    } as { [key in Gap]: string },
  },
})

type StyleProps = {
  /** コンポーネントの上端から、包含ブロックの上端までの間隔（基準フォントサイズの相対値または抽象値） */
  top?: CharRelativeSize | AbstractSize
  /** コンポーネントの下端から、包含ブロックの下端までの間隔（基準フォントサイズの相対値または抽象値） */
  bottom?: CharRelativeSize | AbstractSize
  /** コンポーネントの `z-index` 値 */
  zIndex?: number
}
type Props = StyleProps & {
  /** 表示する `Button` または `AnchorButton` コンポーネント */
  primaryButton: ReactNode
  /** 表示する `Button` または `AnchorButton` コンポーネント */
  secondaryButton?: ReactNode
  /** tertiary 領域に表示するボタン */
  tertiaryButton?: ReactNode
  /** 操作に対するフィードバックメッセージ */
  responseMessage?: ResponseMessageType
  /** 上下の位置を固定するかどうか */
  fixed?: boolean
  /** コンポーネントの幅 */
  width?: string
  /** コンポーネントに適用するクラス名 */
  className?: string
}
type ElementProps = Omit<HTMLAttributes<HTMLDivElement>, keyof Props>

export const FloatArea: FC<Props & ElementProps> = ({
  primaryButton,
  secondaryButton,
  tertiaryButton,
  responseMessage,
  fixed = false,
  className = '',
  top,
  bottom,
  width,
  zIndex,
  ...props
}) => {
  const { wrapperProps } = useMemo(
    () => ({
      wrapperProps: {
        className: floatArea({
          fixed,
          className: `${className} ${zIndex ? `shr-z-[${zIndex}]` : 'shr-z-[500]'}`,
          top: top || top === 0 ? top : undefined,
          bottom: bottom || bottom === 0 ? bottom : undefined,
        }),
        style: width ? { width } : undefined,
      },
    }),
    [className, bottom, fixed, top, width, zIndex],
  )

  return (
    <Base {...wrapperProps} {...props} layer={3} padding={1}>
      <Cluster gap={1}>
        {tertiaryButton && tertiaryButton}
        <div className="shr-ms-auto">
          <Cluster gap={1} align="center">
            {(responseMessage?.status === 'success' || responseMessage?.status === 'error') && (
              <ResponseMessage type={responseMessage.status}>
                {responseMessage.text}
              </ResponseMessage>
            )}
            <Cluster gap={1}>
              {secondaryButton && secondaryButton}
              {primaryButton && primaryButton}
            </Cluster>
          </Cluster>
        </div>
      </Cluster>
    </Base>
  )
}
