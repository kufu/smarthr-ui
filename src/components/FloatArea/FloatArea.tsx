import React, {
  ComponentProps,
  FunctionComponentElement,
  HTMLAttributes,
  ReactNode,
  VFC,
} from 'react'
import styled, { css } from 'styled-components'

import { Theme, useTheme } from '../../hooks/useTheme'
import { DialogBase as BaseComponent } from '../Base'
import { FaExclamationCircleIcon } from '../Icon'
import { Cluster, LineUp } from '../Layout'
import { Text } from '../Text'

import { useClassNames } from './useClassNames'

type StyleProps = {
  /** コンポーネントの上端から、包含ブロックの上端までの距離 */
  top?: number | string
  /** コンポーネントの下端から、包含ブロックの下端までの距離 */
  bottom?: number | string
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
  errorText?: string
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

const exist = (value: any) => {
  return value !== undefined && value !== null
}

export const FloatArea: VFC<Props & ElementProps> = ({
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

const Base = styled(BaseComponent)<StyleProps & { themes: Theme; $width?: string; fixed: boolean }>`
  ${({ themes: { spacingByChar }, top, bottom, $width, fixed, zIndex = 500 }) =>
    css`
      position: ${fixed ? 'fixed' : 'sticky'};
      ${exist(top) &&
      css`
        top: ${typeof top === 'number' ? `${top}px` : top};
      `}
      ${exist(bottom) &&
      css`
        bottom: ${typeof bottom === 'number' ? `${bottom}px` : bottom};
      `}
      z-index: ${zIndex};
      ${$width &&
      css`
        width: ${$width};
      `}
      padding: ${spacingByChar(1)};
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
