import React, {
  ComponentProps,
  FC,
  FunctionComponentElement,
  HTMLAttributes,
  ReactNode,
} from 'react'
import styled, { css } from 'styled-components'

import { useSpacing } from '../../hooks/useSpacing'
import { Theme, useTheme } from '../../hooks/useTheme'
import { AbstractSize, CharRelativeSize } from '../../themes/createSpacing'
import { Base as shrBase } from '../Base'
import { FaExclamationCircleIcon } from '../Icon'
import { Cluster, LineUp } from '../Layout'
import { Text } from '../Text'

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
  /** エラーメッセージ */
  errorText?: ReactNode
  /**
   * エラーメッセージのアイコン（`FaExclamationCircleIcon` を指定）
   */
  errorIcon?: FunctionComponentElement<ComponentProps<typeof FaExclamationCircleIcon>>
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
  errorText,
  errorIcon,
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
      themes={theme}
      className={`${className} ${classNames.wrapper}`}
      $width={width}
      fixed={fixed}
    >
      <Cluster gap={1}>
        {tertiaryButton && tertiaryButton}
        <RightSide>
          <Cluster gap={1}>
            {errorText && (
              <ErrorMessage gap={0.25} vAlign="center" as="p" className={classNames.errorText}>
                {errorIcon && <ErrorIcon themes={theme}>{errorIcon}</ErrorIcon>}
                <Text size="S">{errorText}</Text>
              </ErrorMessage>
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
  StyleProps & { themes: Theme; $width: Props['width']; fixed: Props['fixed'] }
>`
  ${({ themes: { space }, top, bottom, $width, fixed, zIndex = 500 }) =>
    css`
      position: ${fixed ? 'fixed' : 'sticky'};
      ${(top || top === 0) && `top: ${useSpacing(top)};`}
      ${(bottom || bottom === 0) && `bottom: ${useSpacing(bottom)};`}
      z-index: ${zIndex};
      padding: ${space(1)};
      ${$width && `width: ${$width};`}
    `}
`
const RightSide = styled.div`
  margin-left: auto;
`
const ErrorMessage = styled(LineUp)`
  margin-top: 0;
  margin-bottom: 0;
`
const ErrorIcon = styled.span<{ themes: Theme }>`
  flex-shrink: 0;

  > svg {
    display: block; /* 隙間対策 */
  }
`
