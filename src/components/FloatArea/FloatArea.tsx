import React, { FC, HTMLAttributes, ReactNode } from 'react'
import styled, { css } from 'styled-components'

import { useSpacing } from '../../hooks/useSpacing'
import { Theme, useTheme } from '../../hooks/useTheme'
import { AbstractSize, CharRelativeSize } from '../../themes/createSpacing'
import { ResponseMessageType } from '../../types'
import { Base as shrBase } from '../Base'
import { Cluster } from '../Layout'
import { ResponseMessage } from '../ResponseMessage'

import { useClassNames } from './useClassNames'

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
  width,
  ...props
}) => {
  const theme = useTheme()
  const classNames = useClassNames()

  return (
    <Base
      {...props}
      $themes={theme}
      className={`${className} ${classNames.wrapper}`}
      $width={width}
      fixed={fixed}
    >
      <Cluster gap={1}>
        {tertiaryButton && tertiaryButton}
        <RightSide>
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
        </RightSide>
      </Cluster>
    </Base>
  )
}

const Base = styled(shrBase).attrs({ layer: 3 })<
  StyleProps & { $themes: Theme; $width: Props['width']; fixed: Props['fixed'] }
>`
  ${({ $themes: { space }, top, bottom, $width, fixed, zIndex = 500 }) => css`
    position: ${fixed ? 'fixed' : 'sticky'};
    ${(top || top === 0) && `top: ${useSpacing(top)};`}
    ${(bottom || bottom === 0) && `bottom: ${useSpacing(bottom)};`}
      z-index: ${zIndex};
    padding: ${space(1)};
    ${$width && `width: ${$width};`}
  `}
`
const RightSide = styled.div`
  margin-inline-start: auto;
`
