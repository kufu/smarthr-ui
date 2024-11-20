import React, { ComponentPropsWithoutRef, FC, ReactNode, useMemo } from 'react'
import { tv } from 'tailwind-variants'

import { AbstractSize, CharRelativeSize } from '../../themes/createSpacing'
import { Gap, ResponseMessageType } from '../../types'
import { Base } from '../Base'
import { Cluster } from '../Layout'
import { ResponseMessage } from '../ResponseMessage'

const floatArea = tv({
  base: 'smarthr-ui-FloatArea shr-z-fixed-menu shr-sticky -shr-mx-0.5',
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
    } as { [key in Gap]: string },
  },
  defaultVariants: {
    bottom: 1.5,
  },
})

type StyleProps = {
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
}
type ElementProps = Omit<ComponentPropsWithoutRef<'div'>, keyof Props>

export const FloatArea: FC<Props & ElementProps> = ({
  primaryButton,
  secondaryButton,
  tertiaryButton,
  responseMessage,
  bottom,
  zIndex,
  style,
  className,
  ...rest
}) => {
  const styleProps = useMemo(
    () => ({
      style: { ...style, zIndex },
    }),
    [style, zIndex],
  )

  return (
    <Base
      {...styleProps}
      {...rest}
      className={floatArea({ bottom, className })}
      layer={3}
      padding={1}
    >
      <Cluster gap={1}>
        {tertiaryButton}
        <div className="shr-ms-auto">
          <Cluster gap={1} align="center">
            {(responseMessage?.status === 'success' || responseMessage?.status === 'error') && (
              <ResponseMessage type={responseMessage.status}>
                {responseMessage.text}
              </ResponseMessage>
            )}
            <Cluster gap={1}>
              {secondaryButton}
              {primaryButton}
            </Cluster>
          </Cluster>
        </div>
      </Cluster>
    </Base>
  )
}
